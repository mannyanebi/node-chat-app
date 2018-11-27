// addUser(id, name, room)
// removeUser(id)
// getUser(id)
// getUserList(room)

class Users {
    constructor () {
        this.users = [];
    }
    addUser (id, name, room){
        var user = {
            id: id,
            name: name,
            room: room
        };
        this.users.push(user);
        return user;
    }

    removeUser(id){
        //gets the user whose id mataches the id provided
        let user = this.getUser(id);

        if(user){
            this.users = this.users.filter(function (user) {
                user.id !== id;
            });
        }

        return user;
    }

    getUser(id){
        //gets the user whose id matches the id provided
        let user = this.users.filter(function (user) {
            return user.id === id;
        });
        //return the user
        //why [0] because the user would be an array of object
        return user[0];
    }

    getUsersList(room){
        //gets the list of users in the users 
        //array that have room value equals to room
        let users = this.users.filter(function (user) {
            return user.room === room;
        })
        //stripe out the names only of the users from the above users array
        let namesArray = users.map(function (user) {
            return user.name;
        })
        //return namesArray
        return namesArray;
    }
};

module.exports = {
    Users: Users
}