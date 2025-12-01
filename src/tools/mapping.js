function roleMapping(role){
    switch(role){
        case "0":
            return "SUPADM";
        case "1":
            return "NORM";  
        default:
            return null;      
    }
}

function roleMappingRaw(role){
    switch(role){
        case "SUPADM":
            return 0;
        case "NORM":
            return 1;  
        default:
            return null;      
    }
}

function authRole(role, array_all_role_to_check){
    return array_all_role_to_check.includes(role)
}


module.exports = {
    roleMapping,
    authRole,
    roleMappingRaw
}
