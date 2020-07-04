const emailTemplate = (options) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Activate Your RedMonkey Account</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      href="https://fonts.googleapis.com/css?family=Rubik:400,900&display=swap"
      rel="stylesheet"
    />
  </head>
  <body
    style="margin: 0;padding: 0;font-family: 'Rubik', sans-serif;"
  >
    <table style="width: 100%;border-collapse: collapse;">
      <tr>
        <th style="padding: 15px 0;">
          <table
            style="border-collapse: collapse;width: 80%;margin: 0 auto;text-align: left;padding: 10px 0px;"
          >
            <tr>
              <th
                style="font-size: 30px;color: #6a2e35;padding: 10px 0;"
              >
                  <span style="font-weight: 900;">Red</span
                  ><span style="font-weight: 400;">Monkey</span>
              </th>
            </tr>
            <tr>
              <td>
                <table
                  style="border-collapse: collapse; width: 100%;font-weight: 400; line-height: 1.5;"
                >
                ${
                  options.situation === 'email_confirmation'
                    ? `
                  <tr>
                    <td>
                      <p style="text-transform: capitalize;">
                        Hello ${options.name},
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>
                        Welcome to
                        <a style="text-decoration: none;" href="${process.env.CLIENT_URL}/">RedMonkey</a
                        >, an online education platform.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      To activate your account please click
                      <a href="${options.url}" style="text-decoration: none;">here</a> or the
                      button provided below:
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 35px 0;text-align: center;">
                      <a
                        href="${options.url}"
                        style="padding: 20px;text-decoration: none;background: #6a2e35;color: #e3d081;letter-spacing: 0.5px;font-weight: 400;text-align: center;"
                        >Activate Account</a
                      >
                    </td>
                  </tr>`
                    : options.situation === 'two_factor_code'
                    ? `
                  <tr>
                    <td>
                      <p style="text-transform: capitalize;">
                        Hello ${options.name},
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      A signin attempt requires further verification. To complete the sign in process, enter this verification code: ${options.code}
                    </td>
                  </tr>
                  `
                    : options.situation === 'password_reset'
                    ? `<tr>
                    <td>
                      <p>
                        Hello ${options.name},
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Your <a style="text-decoration: none;" href="${process.env.CLIENT_URL}/">RedMonkey</a
                      > password can be reset by clicking <a href="${options.url}" style="text-decoration: none;">here</a> or the
                      button provided below:
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 35px 0;text-align: center;">
                      <a
                        href="${options.url}"
                        style="padding: 20px;text-decoration: none;background: #6a2e35;color: #e3d081;letter-spacing: 0.5px;font-weight: 400;text-align: center;"
                        >Reset Password</a
                      >
                    </td>
                  </tr>`
                    : ''
                }
                  <tr>
                    <td style="padding: 20px 0 3px 0;">
                      <span
                        style="display: block;border: solid 1px #dddd;"
                      ></span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <small style="color: grey;"
                        >&copy; 2020 RedMonkey. All Rights Reserved.</small
                      >
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </th>
      </tr>
    </table>
  </body>
</html>`;

module.exports = emailTemplate;
