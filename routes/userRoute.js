const fs = require('fs');
const {join} = require('path');

const filePath = join(__dirname, 'users.json');

const getUsers = () =>{
    const data = fs.existsSync(filePath)
    ? fs.readFileSync(filePath)
    : [];

    try{
        return JSON.parse(data);
    } catch(error){
        return [];
    }
}

const saveUser = (users) => fs.writeFileSync(filePath, JSON.stringify(users, null, '\t'));

const userRoute = (app) => {
    app.route('/users/:id?').get((req, res) => {
        const users = getUsers();
        
        res.send({users})
    })
    .post((req, res) => {
        const users = getUsers();

        users.push(req.body);
        saveUser(users);

        res.status(200).send('user has been created!');
    })
    .put((req, res) => {
        const users = getUsers();

        saveUser(users.map(user => {
            if (users.id === req.params.id){
                return {
                    ... user,
                    ... req.body
                }
            }
            return users;
        }))
        res.status(200).send('user has been added!');
    })
    .delete((req, res) => {
        const users = getUsers();

        saveUser(users.filter(user => user.id !== req.params.id));

        res.status(200).send('user has been deleted!');
    })
}


module.exports = userRoute