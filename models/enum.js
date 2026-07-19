const UserType=Object.freeze({
    Admin:'Admin',
    User:'User'
})


const Priority = Object.freeze({
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High'
});

const Status = Object.freeze({
    DRAFT: 'Draft',
    ACTIVE: 'Active',
    ARCHIVED: 'Archived',
    COMPLETED:'Completed'
});

const Category = Object.freeze({
    WORK: 'Work',
    MEETING: 'Meeting',
    PERSONAL: 'Personal',
    STUDY: 'Study'
});

module.exports = {
    UserType,
    Priority,
    Status,
    Category
};