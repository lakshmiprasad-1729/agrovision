

class ApiResponse{
    constructor(statuscode,data,message ){
        this.message = message,
        this.data = data,
        this.statuscode = statuscode
    }
}


export default ApiResponse;