
const regTemplate = (name, email)=>{
    return `<div>
            <h1 style="color:slateblue;">Welcome ${name} to CMS-v1.0</h1>
            <article style="margin:auto; object-fit: 'cover';">
                <img src="https://w7.pngwing.com/pngs/676/751/png-transparent-handshake-cooperation-white-3d-villain-business-man-cooperation.png" width="300" height="300" />

                <h4> We are excited to have you get started with mail id = <span style="color:orangered;">${email}</span> Your account is ready to use.</h4>
            </article>
    </div>`

}

module.exports = regTemplate