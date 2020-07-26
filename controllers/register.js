

const handleRegister = (req, res, db, bcrypt) => {
    // Destructuring
    // coming from POSTMAN, info below
    const { email, name, password } = req.body;
    if (!email || !name || !password ) {
        return res.status(400).json('incorrect form submission')
    }
    const hash = bcrypt.hashSync(password);
        db.transaction(trx => {
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => { 
                return trx('users')
                .returning('*')
                .insert({
                    email: loginEmail[0],
                    name: name,
                    joined: new Date()
                })
                .then(user => {
                    res.json(user[0]);
                })        
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
    .catch(err => res.status(400).json('unable to register'))
    // we grab the new user created[we want to grab the last user, the last item in the array, the last user.]
}

module.exports= {
    handleRegister: handleRegister
};