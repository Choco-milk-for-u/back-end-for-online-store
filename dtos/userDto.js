module.exports = class UserDto {
    id;
    email;
    isActivated;
    role;

    constructor(model){
        this.email = model.email;
        this.role = model.role;
        this.id = model._id;
        this.isActivated = model.isActivated;
    }
}