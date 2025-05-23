const emailHeaderFooter = (body: string) => {
  return `
  <!DOCTYPE html>
<html>
  <head>
    <title></title>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <meta content="width=device-width, initial-scale=1.0" name="viewport" />
  </head>
  <body
    style="
      background-color: #fafdff;
      padding: 16px;
      font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS',
        sans-serif;
    "
  >
    <table
      style="
        background-color: white;
        padding: 16px;
        border-width: 1px;
        border-color: #d3d2d366;
        border-style: solid;
        border-radius: 4px;
      "
      width="100%"
    >
      <tbody>
        <tr>
          <td style="margin-bottom: 40px">
            <img
              src="https://res.cloudinary.com/dscnzgig1/image/upload/v1740014517/logo_exxgyz.png"
              style="width: 180px; height: 64px"
            />
          </td>
        </tr>
        <tr>
          <td>
          <div>
          ${body}
          </div>
          </td>
        </tr>
      </tbody>
    </table>
    <table style="width: 100%; padding-top: 32px; padding-bottom: 32px">
      <tbody style="width: 100%">
        <tr style="display: flex; align-items: center; "> 
          <td>
            <img
              src="https://res.cloudinary.com/dscnzgig1/image/upload/v1740014517/logo_exxgyz.png"
              style="height: 40px; width: 117px"
            />
          </td>
        </tr>
        <tr >
          <td>
            <p style=" color: #6c686c;">
              Create, promote, and monetise courses while transforming learning
              experiences with powerful, AI-driven tools.
            </p>
          </td>
        </tr>
        <tr style="width: 100%;">
          <td style="width: 100%;">
            <div style="display: flex; align-items: center; width: 100%;">
              <a style="margin-right: 20px">
                <svg
                  width="32"
                  height="33"
                  viewBox="0 0 32 33"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 8.01172C0 3.59344 3.58172 0.0117188 8 0.0117188H24C28.4183 0.0117188 32 3.59344 32 8.01172V24.0117C32 28.43 28.4183 32.0117 24 32.0117H8C3.58172 32.0117 0 28.43 0 24.0117V8.01172Z"
                    fill="#004D99"
                  />
                  <path
                    d="M11.576 10.4133C11.5758 10.8376 11.407 11.2445 11.1068 11.5444C10.8066 11.8443 10.3995 12.0127 9.97518 12.0125C9.55083 12.0123 9.14395 11.8435 8.84404 11.5433C8.54413 11.2431 8.37576 10.836 8.37598 10.4117C8.37619 9.98735 8.54496 9.58047 8.84517 9.28056C9.14538 8.98066 9.55243 8.81229 9.97678 8.8125C10.4011 8.81271 10.808 8.98149 11.1079 9.28169C11.4078 9.5819 11.5762 9.98895 11.576 10.4133ZM11.624 13.1973H8.42398V23.2133H11.624V13.1973ZM16.68 13.1973H13.496V23.2133H16.648V17.9573C16.648 15.0293 20.464 14.7573 20.464 17.9573V23.2133H23.624V16.8693C23.624 11.9333 17.976 12.1173 16.648 14.5413L16.68 13.1973Z"
                    fill="white"
                  />
                </svg>
              </a>
              <a style="margin-right: 20px">
                <svg
                  width="32"
                  height="33"
                  viewBox="0 0 32 33"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 8.01172C0 3.59344 3.58172 0.0117188 8 0.0117188H24C28.4183 0.0117188 32 3.59344 32 8.01172V24.0117C32 28.43 28.4183 32.0117 24 32.0117H8C3.58172 32.0117 0 28.43 0 24.0117V8.01172Z"
                    fill="#004D99"
                  />
                  <path
                    d="M16.8229 8.0127C17.4066 8.01046 17.9904 8.01633 18.5741 8.0303L18.7293 8.0359C18.9085 8.0423 19.0853 8.0503 19.2989 8.0599C20.1501 8.0999 20.7309 8.2343 21.2405 8.4319C21.7685 8.6351 22.2133 8.9103 22.6581 9.3551C23.0648 9.75479 23.3795 10.2383 23.5805 10.7719C23.7781 11.2815 23.9125 11.8631 23.9525 12.7143C23.9621 12.9271 23.9701 13.1047 23.9765 13.2839L23.9813 13.4391C23.9955 14.0225 24.0016 14.606 23.9997 15.1895L24.0005 15.7863V16.8343C24.0024 17.4181 23.9963 18.0019 23.9821 18.5855L23.9773 18.7407C23.9709 18.9199 23.9629 19.0967 23.9533 19.3103C23.9133 20.1615 23.7773 20.7423 23.5805 21.2519C23.3802 21.7861 23.0653 22.27 22.6581 22.6695C22.258 23.0762 21.7743 23.3909 21.2405 23.5919C20.7309 23.7895 20.1501 23.9239 19.2989 23.9639C19.0853 23.9735 18.9085 23.9815 18.7293 23.9879L18.5741 23.9927C17.9904 24.0069 17.4067 24.0131 16.8229 24.0111L16.2261 24.0119H15.1789C14.5951 24.0139 14.0113 24.0077 13.4277 23.9935L13.2725 23.9887C13.0825 23.9818 12.8927 23.9738 12.7029 23.9647C11.8517 23.9247 11.2709 23.7887 10.7605 23.5919C10.2266 23.3914 9.74305 23.0766 9.34366 22.6695C8.9365 22.2697 8.62144 21.786 8.42046 21.2519C8.22286 20.7423 8.08846 20.1615 8.04846 19.3103C8.03955 19.1205 8.03155 18.9306 8.02446 18.7407L8.02046 18.5855C8.00571 18.0019 7.99905 17.4181 8.00046 16.8343V15.1895C7.99823 14.606 8.0041 14.0225 8.01806 13.4391L8.02366 13.2839C8.03006 13.1047 8.03806 12.9271 8.04766 12.7143C8.08766 11.8623 8.22206 11.2823 8.41966 10.7719C8.62076 10.238 8.93643 9.75466 9.34446 9.3559C9.74358 8.9485 10.2268 8.63316 10.7605 8.4319C11.2709 8.2343 11.8509 8.0999 12.7029 8.0599L13.2725 8.0359L13.4277 8.0319C14.011 8.01716 14.5945 8.01049 15.1781 8.0119L16.8229 8.0127ZM16.0005 12.0127C15.4705 12.0052 14.9443 12.1031 14.4524 12.3008C13.9606 12.4984 13.513 12.7918 13.1355 13.1639C12.7581 13.5361 12.4584 13.9795 12.2538 14.4685C12.0492 14.9575 11.9439 15.4823 11.9439 16.0123C11.9439 16.5424 12.0492 17.0671 12.2538 17.5561C12.4584 18.0451 12.7581 18.4885 13.1355 18.8607C13.513 19.2328 13.9606 19.5262 14.4524 19.7238C14.9443 19.9215 15.4705 20.0194 16.0005 20.0119C17.0613 20.0119 18.0787 19.5905 18.8289 18.8403C19.579 18.0902 20.0005 17.0728 20.0005 16.0119C20.0005 14.951 19.579 13.9336 18.8289 13.1835C18.0787 12.4333 17.0613 12.0127 16.0005 12.0127ZM16.0005 13.6127C16.3193 13.6068 16.636 13.6645 16.9323 13.7825C17.2285 13.9004 17.4983 14.0762 17.7259 14.2995C17.9534 14.5229 18.1342 14.7894 18.2576 15.0834C18.381 15.3774 18.4446 15.693 18.4447 16.0119C18.4447 16.3308 18.3812 16.6464 18.2579 16.9405C18.1346 17.2345 17.9539 17.5011 17.7265 17.7245C17.499 17.9479 17.2293 18.1238 16.933 18.2418C16.6368 18.3599 16.3201 18.4177 16.0013 18.4119C15.3647 18.4119 14.7543 18.159 14.3042 17.709C13.8541 17.2589 13.6013 16.6484 13.6013 16.0119C13.6013 15.3754 13.8541 14.7649 14.3042 14.3148C14.7543 13.8648 15.3647 13.6119 16.0013 13.6119L16.0005 13.6127ZM20.2005 10.8127C19.9424 10.823 19.6983 10.9328 19.5193 11.1191C19.3404 11.3053 19.2405 11.5536 19.2405 11.8119C19.2405 12.0702 19.3404 12.3185 19.5193 12.5047C19.6983 12.691 19.9424 12.8008 20.2005 12.8111C20.4657 12.8111 20.72 12.7057 20.9076 12.5182C21.0951 12.3307 21.2005 12.0763 21.2005 11.8111C21.2005 11.5459 21.0951 11.2915 20.9076 11.104C20.72 10.9165 20.4657 10.8111 20.2005 10.8111V10.8127Z"
                    fill="white"
                  />
                </svg>
              </a>
              <a>
                <svg
                  width="32"
                  height="33"
                  viewBox="0 0 32 33"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 8.01172C0 3.59344 3.58172 0.0117188 8 0.0117188H24C28.4183 0.0117188 32 3.59344 32 8.01172V24.0117C32 28.43 28.4183 32.0117 24 32.0117H8C3.58172 32.0117 0 28.43 0 24.0117V8.01172Z"
                    fill="#004D99"
                  />
                  <path
                    d="M7.2002 8.01172H9.2002L21.2002 24.0117H19.2002L7.2002 8.01172Z"
                    fill="white"
                  />
                  <path
                    d="M10.7998 8.01172H12.7998L24.7998 24.0117H22.7998L10.7998 8.01172Z"
                    fill="white"
                  />
                  <path
                    d="M8.7998 8.01172H12.7998V9.61172H8.7998V8.01172Z"
                    fill="white"
                  />
                  <path
                    d="M19.2002 24.0102H23.2002V22.4102H19.2002V24.0102Z"
                    fill="white"
                  />
                  <path
                    d="M21.1996 8.01172H23.9996L10.3996 24.0117H7.59961L21.1996 8.01172Z"
                    fill="white"
                  />
                </svg>
              </a>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div style="display: flex; align-items: center; ">
              <a
                href="https://staging.recycledlearning.com/contact-us"
                target="_blank"
                style="margin-right: 40px; text-decoration: none"
              >
                <p style="color: #004d99; font-weight: 600; font-size: 14px">
                  Contact Us
                </p>
              </a>
              <a
                href="https://staging.recycledlearning.com/privacy"
                href=""
                target="_blank"
                style="margin-right: 40px; text-decoration: none"
              >
                <p style="color: #004d99; font-weight: 600; font-size: 14px">
                  Privacy Policy
                </p>
              </a>
              <a
                href="https://staging.recycledlearning.com/terms-and-conditions"
                target="_blank"
                style="text-decoration: none"
              >
                <p style="color: #004d99; font-weight: 600; font-size: 14px">
                  Terms of Use
                </p>
              </a>
            </div>
          </td>
        </tr>
        <tr style="margin: 0;">
          <td>
            <p style="color: #6c686c;  margin: 10px 0; padding: 0; ">
              © 2025 Recycled Learning. All rights reserved.
            </p>
          </td>
        </tr>
        <tr style="margin: 0;">
          <td>
            <p style="color: #6c686c; margin: 10px 0; padding: 0;">
              Vine Cottage, 215 North Street, Romford, Essex <br />
              United Kingdom, RM1 4QA
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>

    `;
};

export const organisationCreationEmail = ({ name, verifyLink }) => {
  return emailHeaderFooter(`
          <div>
              <p style="font-size: 24px; font-weight: 600">
                Your Recycled Learning Journey Begins—Activate Your Account
              </p>
              <br />
              <p style="font-size: 18px; font-weight: 600">
                Hello ${name}
              </p>
              <p style="color: #6c686c; font-size: 18px">
                Welcome to Recycled Learning! You’re just one step away from
                building powerful learning experiences with our platform. To
                activate your account and access your admin dashboard, please
                verify your email by clicking the button below:
              </p>
              <br/>
              <a
                href=${verifyLink}
                target="_blank"
                style="
                  background-color: #004d99;
                  border-radius: 8px;
                  padding: 14px 24px;
                  color: white;
                  text-decoration: none;
                "
              >
                Verify My Email
              </a>
              <br/>
              <br/>

              <p style="color: #6c686c; font-size: 18px">
                If the button doesn’t work, copy and paste this link into your
                browser:
              </p>
              <p style="color:#004D99; font-size: 18px">
                ${verifyLink}
              </p>

              <div style="border-top: 1px solid #D3D2D366; margin: 40px 0px;"></div>
              <p style="font-size: 20px; font-weight: 500">What’s Next?</p>
              <p  style="color: #6c686c; font-size: 18px">Once your account is activated, you’ll be able to:</p>
              <ul>
                <li  style="color: #221d23; font-size: 18px">
                  Customise your platform with your organisation’s branding.
                </li>
                <li  style="color: #221d23; font-size: 18px">Create courses, manage users, and monitor performance.</li>
                <li  style="color: #221d23; font-size: 18px">
                  Deliver engaging learning experiences that transform
                  education.
                </li>
              </ul>
              <div style="border-top: 1px solid #D3D2D366; margin: 40px 0px;"></div>

              <p style="color: #6c686c; font-size: 18px">
                If you didn’t initiate this registration, please ignore this
                email or contact our support team.
              </p>
              <p style="color: #6c686c; font-size: 18px">
                We’re thrilled to have you join the Recycled Learning community!
              </p>
              <p style="color: #6c686c; font-size: 18px">Warm regards,</p>
              <p style="color: #221d23; font-size: 18px; font-weight: 600;">The Recycled Learning Team</p>
            </div>
    `);
};

export const organisationVerificationEmail = ({ name, verifyLink }) => {
  return emailHeaderFooter(`
          <div>
              <p style="font-size: 24px; font-weight: 600">
               Activate Your Recycled Learning Account
              </p>
              <br />
              <p style="font-size: 18px; font-weight: 600">
                Hello ${name}
              </p>
              <p style="color: #6c686c; font-size: 18px">
                You’re just one step away from
                building powerful learning experiences with our platform. To
                activate your account and access your admin dashboard, please
                verify your email by clicking the button below:
              </p>
              <br/>
              <a
                href=${verifyLink}
                target="_blank"
                style="
                  background-color: #004d99;
                  border-radius: 8px;
                  padding: 14px 24px;
                  color: white;
                  text-decoration: none;
                "
              >
                Verify My Email
              </a>
              <br/>
              <br/>

              <p style="color: #6c686c; font-size: 18px">
                If the button doesn’t work, copy and paste this link into your
                browser:
              </p>
              <p style="color:#004D99; font-size: 18px">
                ${verifyLink}
              </p>

              <div style="border-top: 1px solid #D3D2D366; margin: 40px 0px;"></div>
              <p style="font-size: 20px; font-weight: 500">What’s Next?</p>
              <p  style="color: #6c686c; font-size: 18px">Once your account is activated, you’ll be able to:</p>
              <ul>
                <li  style="color: #221d23; font-size: 18px">
                  Customise your platform with your organisation’s branding.
                </li>
                <li  style="color: #221d23; font-size: 18px">Create courses, manage users, and monitor performance.</li>
                <li  style="color: #221d23; font-size: 18px">
                  Deliver engaging learning experiences that transform
                  education.
                </li>
              </ul>
              <div style="border-top: 1px solid #D3D2D366; margin: 40px 0px;"></div>

              <p style="color: #6c686c; font-size: 18px">
                If you didn’t initiate this registration, please ignore this
                email or contact our support team.
              </p>
              <p style="color: #6c686c; font-size: 18px">
                We’re thrilled to have you join the Recycled Learning community!
              </p>
              <p style="color: #6c686c; font-size: 18px">Warm regards,</p>
              <p style="color: #221d23; font-size: 18px; font-weight: 600;">The Recycled Learning Team</p>
            </div>
    `);
};

export const organisationPasswordResetEmail = ({ name, resetLink }) => {
  return emailHeaderFooter(`
      <div>
              <p style="font-size: 24px; font-weight: 600">
                Reset Your Recycled Learning Password
              </p>
              <br />
              <p style="font-size: 18px; font-weight: 600">
                Hello ${name}
              </p>
              <p style="color: #6c686c; font-size: 18px">
                We received a request to reset your password for your Recycled
                Learning account. If you made this request, click the button
                below to reset your password
              </p>
              <br />
              <a
                href=${resetLink}
                target="_blank"
                style="
                  background-color: #004d99;
                  border-radius: 8px;
                  padding: 14px 24px;
                  color: white;
                  text-decoration: none;
                "
              >
                Reset My Password
              </a>
              <br />
              <br />

              <p style="color: #6c686c; font-size: 18px">
                If the button doesn’t work, copy and paste this link into your
                browser:
              </p>
              <p style="color: #004d99; font-size: 18px">
              ${resetLink}
              </p>

              <div
                style="border-top: 1px solid #d3d2d366; margin: 40px 0px"
              ></div>
              <p style="font-size: 20px; font-weight: 500">
                Important Information
              </p>
              <p style="color: #6c686c; font-size: 18px">
                Once your account is activated, you’ll be able to:
              </p>
              <ul>
                <li style="color: #221d23; font-size: 18px">
                  For your security, this link will expire in 24 hours.
                </li>
                <li style="color: #221d23; font-size: 18px">
                  If you didn’t request a password reset, please ignore this
                  email or contact us immediately.
                </li>
              </ul>
              <div
                style="border-top: 1px solid #d3d2d366; margin: 40px 0px"
              ></div>

              <p style="color: #6c686c; font-size: 18px">
                Thank you for choosing Recycled Learning!
              </p>
              <p style="color: #6c686c; font-size: 18px">Warm regards,</p>
              <p style="color: #221d23; font-size: 18px; font-weight: 600">
                The Recycled Learning Team
              </p>
            </div>
    `);
};

export const schoolUserAdditionEmail = ( name:string, password:string, schoolName:string, domain:string, email:string, role:string ) => {
  return emailHeaderFooter(`
      <div>
              <p style="font-size: 24px; font-weight: 600">
              You have been added as a School ${role} for ${schoolName}
              </p>
              <br />
              <p style="font-size: 18px; font-weight: 600">
                Hello ${name}
              </p>
              <p style="color: #6c686c; font-size: 18px">
                You have been added as a School ${role} for ${schoolName}, 
                please login using the following details:
                <br/>
                Email: ${email}
                <br/>
                Password: ${password}
                <br/>
                Login: ${domain}/login
                <br>
                You can change your password after logging in.
              </p>
              <br />
              <br />
              <p>
              Please note, If you don't login in the next 3 days, this invite will be revoked.
              </p>
              <br />
              <br />

              <p style="color: #6c686c; font-size: 18px">
                Thank you for choosing Recycled Learning!
              </p>
              <p style="color: #6c686c; font-size: 18px">Warm regards,</p>
              <p style="color: #221d23; font-size: 18px; font-weight: 600">
                The Recycled Learning Team
              </p>
            </div>
    `);
};
