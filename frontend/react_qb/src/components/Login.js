import React from "react";
import axios from "axios";

function Login() {
    let username = "",
        password = "";

    function handleUsernameChange(e) {
        username = e.target.value;
        console.log("username = " + username);
    }

    function handlePasswordChange(e) {
        password = e.target.value;
    }

    function handleLogin(e) {
        e.preventDefault();

        const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2MjEzMzY1MzUsImV4cCI6MTYyMTM0MDEzNSwicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoidGVzdF91c2VyMSJ9.tAUst30Nf1X9sNQOIydE9gd7cXrpr8kx6ILpR41zT_TOPgkdw8pUPf9fIS2PxV1gS5BGUszbx5ZnH4yxmUWl2Pcdkukl8vUuO5H1XR77YIotSfO4DsoOzM8TUw_3M3sh10U3CN-bQuvdV18Cqxl2KllCboEf9dvIlHQGVV5Gy-l1daXOcyDojywPHQOIN7gNgrZWoQvNdIFFZohhn-hEFR7C7-Zm5y1Sy5vmoD3Rvt5Ql3FdvVESblLbOC0_qZSea5DcPgJcu-USaRZ4zaaqugVy-0K2EUL6O13fK7jRWP1JS62dh8VA_ssiAbATPthUA2p0Wc0KhUh9qh7Fe6H15lapz_fsFPw86F1s6T1lwFadr8zcnRhKMu4YclYCnflIkKx_VPL5ir7GJLaYsqUZHa1w8D7MdtZUqrHIqy4IJh8IDDZBQI2ueG_T8dmDJByf1ASrZsMRK-Bmer6SEDlN0sODT3_kD9ZueibQ-UwVDRUUBB_0Sx1DTQM6hu0DImVLjgWFyGLmz2dHRYHGT0l9PmQTtKdzC4XMjtuSuL6E99hhAElpjF3Krmj0bNQgYAXNjH25jE9S67xNs0Qt_9CSELrhehN5pH8sA5IaTOCcVCo-U6fsqAJGvUacgtVKF0IefGoUHjPGhlJzdKg2h3sacX8tslhFfEpSe8bfQkNlq6c";
        console.log("form submit");
        // const loginUrl = "http://localhost:8000/api/qb/login"
        const loginUrl = "http://localhost:8000/qb/connect";

        axios.get(loginUrl,{ headers: {"Authorization" : `Bearer ${token}`}}).then((response) => {
            if(response.status === 200){
                console.log(response.data);
                console.log(response.data.authUrl);
                window.location.href = response.data.authUrl;
                // axios.get(response.data.authUrl);
            }
            else{
                console.log(
                `Error : ERROR CODE=${response.status} ERROR MESSAGE=${response.statusText}`
                );
            }
        
        });
        // axios
        //     .post(loginUrl, {
        //         username: username,
        //         password: password,
        //     })
        //     .then((response) => {
        //         console.log(response);
        //         // console.log(response.data);
        //         if (response.status === 200) {
        //             console.log(response.data);
        //         } else {
        //             console.log(
        //                 `Error : ERROR CODE=${response.status} ERROR MESSAGE=${response.statusText}`
        //             );
        //         }
        //     })
        //     .catch((error) => {
        //         console.error(`Axios Error: ${error}`);
        //     });
    }

    return (
        <div className="flex flex-col justify-center items-center">
            <p className="mt-4 text-4xl">Login</p>
            <div className="rounded w-96 m-4 bg-gray-50 shadow-lg p-6 align-middle">
                <form onSubmit={handleLogin}>
                    <label>Username</label>
                    <input
                        className="block m-auto w-full my-2 px-2 border-gray-400 focus:border-black border-2 leading-10 rounded-md"
                        onChange={handleUsernameChange}
                        type="text"
                        placeholder="Enter username"
                    />
                    <label>Password</label>
                    <input
                        className="block m-auto w-full my-2 px-2 border-gray-400 focus:border-black border-2 leading-10 rounded-md"
                        onChange={handlePasswordChange}
                        type="text"
                        placeholder="Enter password"
                    />
                    <button
                        type="submit"
                        className="block p-2 mt-4 w-full bg-green-600 text-white rounded-md"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
