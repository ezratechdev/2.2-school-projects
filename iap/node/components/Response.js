const ResponseFunction = (object) =>{
    // token , username , reg , email , workid 
    return({
        ...object.token && { token:object.token },
        ...object.username && { username:object.username },
        ...object.identity && { identity:object.identity },
        ...object.email && { email:object.email },
        ...object.error && { error:object.error },
        ...object.message && { message:object.message },
    })
}

module.exports = {ResponseFunction};