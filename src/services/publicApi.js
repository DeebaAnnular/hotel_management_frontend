import axios from "axios";

const publicAPI = axios.create({
    baseURL:"http://13.127.57.68:8080"
});

export default publicAPI;