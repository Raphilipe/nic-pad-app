const { countDocuments } = require("../models/User");

class UserController {

        constructor() {
                this.User = require("../models/User");
                this.i18n = require("../i18n");
                this.mailerTransporter = require("../mailer");
                this.bcrypt = require("bcrypt");
                this.jwt = require("jsonwebtoken");
        }

        async createUser(Request, Response) {
                if (!Request.body.User) {
                        return Response.status(422).json({ msg: this.i18n.__('email_is_required') });
                }
                if (!this.validateEmail(Request.body.User)) {
                        return Response.status(422).json({ msg: this.i18n.__('email_is_not_valid') });
                }
                if (!Request.body.UserCheck) {
                        return Response.status(422).json({ msg: this.i18n.__('email_confirmation_required') });
                }
                if (Request.body.User !== Request.body.UserCheck) {
                        return Response.status(422).json({ msg: this.i18n.__('email_confirmation_does_not_match') });
                }
                if (!Request.body.FirstName) {
                        return Response.status(422).json({ msg: this.i18n.__('first_name_is_required') });
                }
                if (!Request.body.LastName) {
                        return Response.status(422).json({ msg: this.i18n.__('last_name_is_required') });
                }
                if (!Request.body.Password) {
                        return Response.status(422).json({ msg: this.i18n.__('password_is_required') });
                }
                if (!Request.body.PasswordCheck) {
                        return Response.status(422).json({ msg: this.i18n.__('password_confirmation_is_required') });
                }
                if (Request.body.Password !== Request.body.PasswordCheck) {
                        return Response.status(422).json({ msg: this.i18n.__('password_confirmation_does_not_match') });
                }
                var existingUser = {};
                this.User.findOne({ user: Request.body.User }, function (err, data) {
                        if (data) {
                                existingUser = data;
                        }
                });
                if (existingUser._id !== undefined) {
                        if (existingUser.verified == true) {
                                return Response.status(422).json({ msg: this.i18n.__('user_is_not_available') });
                        }
                }
                this.bcrypt.hash(Request.body.Password, 10, async (errBcrypt, hash) => {
                        if (!errBcrypt) {
                                const activationToken = Math.random().toString(16).substr(2) + Math.random().toString(16).substr(2);
                                if (this.sendVerificationMail(Request, activationToken)) {
                                        if (existingUser._id === undefined) {
                                                const newUser = new this.User({
                                                        user: Request.body.User,
                                                        firstName: Request.body.FirstName,
                                                        lastName: Request.body.LastName,
                                                        password: hash,
                                                        theme: "",
                                                        verified: false,
                                                        activationToken: activationToken
                                                });
                                                await newUser.save();
                                                Response.status(201).json({ msg: this.i18n.__('verify_email_to_complete_signup') });
                                        } else {
                                                const filter = { user: Request.body.User };
                                                const update = { "activationToken": activationToken };
                                                try {
                                                        await this.User.updateOne(filter, update);
                                                        Response.status(201).json({ msg: this.i18n.__('verify_email_to_complete_signup') });
                                                } catch (error) {
                                                }
                                        }
                                } else {
                                        Response.status(500).json({ msg: this.i18n.__('verify_email_send_failed') });
                                };
                        } else {
                                return res.status(500).send({ error: errBcrypt });
                        }
                });
        }

        async authenticateUser(Request, Response) {
                const user = await this.User.findOne({ user: Request.body.User });
                if (!user) {
                        return Response.status(404).json({ msg: this.i18n.__('user_or_password_invalid') });
                }
                if (!user.verified) {
                        return Response.status(404).json({ msg: this.i18n.__('verify_email_to_complete_signup') });
                }
                this.bcrypt.compare(Request.body.Password, user.password, (err, result) => {
                        if (err) {
                                return Response.status(404).json({ msg: this.i18n.__('user_or_password_invalid') });
                        }
                        if (result) {
                                const token = this.jwt.sign({
                                        user: user.user
                                },
                                        process.env.JWT_KEY,
                                        {
                                                expiresIn: process.env.JWT_EXPIRES_IN
                                        }
                                );
                                Response.status(200).json({ msg: this.i18n.__('user_authenticated'), userData: user, token: token });
                        } else {
                                return Response.status(404).json({ msg: this.i18n.__('user_or_password_invalid') });
                        }
                });
        }

        async activateUser(Request, Response) {
                var activated = false;
                const update = { "verified": true, "activationToken": "alreadyActivated" };
                try {
                        const user = await this.User.findOneAndUpdate(Request.query, update);
                        if (user) {
                                activated = true;
                        }
                } catch (error) {
                }
                return activated;
        }

        async disconnectUser(Request, Response) {
                Response.status(200).json({ msg: this.i18n.__('user_disconnected') });
        }

        async getUser(Request, Response) {
                const user = await this.User.find(Request.query);
                Response.send(user);
        }

        async updateUser(Request, Response) {
                const user = await this.User.find(Request.query);
                if (!user) {
                        return Response.status(404).json({ msg: this.i18n.__('user_not_found') });
                }
                try {
                        await this.User.updateOne(Request.query, Request.body);
                        Response.status(201).json({ msg: this.i18n.__('user_updated_successfully') });
                } catch (error) {
                        Response.status(500).json({ msg: error });
                }
        }

        async changePassword(Request, Response) {
                const user = await this.User.findOne({ _id: Request.body._id });
                if (!user) {
                        return Response.status(404).json({ msg: this.i18n.__('user_not_found') });
                }
                if (!Request.body.newPassword) {
                        return Response.status(422).json({ msg: this.i18n.__('password_is_required') });
                }
                if (!Request.body.newPasswordCheck) {
                        return Response.status(422).json({ msg: this.i18n.__('password_confirmation_is_required') });
                }
                if (Request.body.newPassword !== Request.body.newPasswordCheck) {
                        return Response.status(422).json({ msg: this.i18n.__('password_confirmation_does_not_match') });
                }
                this.bcrypt.compare(Request.body.currentPassword, user.password, (err, result) => {
                        if (err) {
                                return Response.status(404).json({ msg: this.i18n.__('password_invalid') });
                        }
                        if (result) {
                                this.bcrypt.hash(Request.body.newPassword, 10, async (errBcrypt, hash) => {
                                        if (!errBcrypt) {
                                                const update = { "password": hash };
                                                try {
                                                        await this.User.updateOne(Request.query, update);
                                                        const token = this.jwt.sign({
                                                                user: user.user
                                                        },
                                                                process.env.JWT_KEY,
                                                                {
                                                                        expiresIn: process.env.JWT_EXPIRES_IN
                                                                }
                                                        );
                                                        Response.status(200).json({ msg: this.i18n.__('password_changed'), userData: user, token: token });
                                                } catch (error) {
                                                        Response.status(500).json({ msg: error });
                                                }

                                        } else {
                                                return res.status(500).send({ error: errBcrypt });
                                        }
                                });
                        } else {
                                return Response.status(404).json({ msg: this.i18n.__('password_invalid') });
                        }
                });
        }

        async sendPasswordReset(Request, Response) {
                const user = await this.User.findOne({ user: Request.body.user });
                if (!user) {
                        return Response.status(201).json({ msg: this.i18n.__('password_reset_sent') });
                }
                if (!user.verified) {
                        return Response.status(201).json({ msg: this.i18n.__('password_reset_sent') });
                }
                const resetPassToken = Math.random().toString(16).substr(2) + Math.random().toString(16).substr(2);
                if (this.sendPassResetMail(Request, resetPassToken)) {
                        const filter = { user: Request.body.user };
                        const update = { "resetPassToken": resetPassToken };
                        try {
                                await this.User.updateOne(filter, update);
                                return Response.status(201).json({ msg: this.i18n.__('password_reset_sent') });
                        } catch (error) {
                        }
                } else {
                        Response.status(500).json({ msg: this.i18n.__('reset_pass_email_send_failed') });
                };
        }

        async checkResetPassTokenValid(Request, Response) {
                var validToken = null;
                const user = await this.User.findOne(Request.query);
                if (user) {
                        validToken = user.resetPassToken;
                }
                return validToken;
        }

        async resetPassword(Request, Response) {
                if (!Request.body.newPassword) {
                        return Response.status(422).json({ msg: this.i18n.__('password_is_required') });
                }
                if (!Request.body.newPasswordCheck) {
                        return Response.status(422).json({ msg: this.i18n.__('password_confirmation_is_required') });
                }
                if (Request.body.newPassword !== Request.body.newPasswordCheck) {
                        return Response.status(422).json({ msg: this.i18n.__('password_confirmation_does_not_match') });
                }

                const user = await this.User.findOne({ resetPassToken: Request.body.resetPassToken });
                if (!user) {
                        return Response.status(404).json({ msg: this.i18n.__('reset_password_token_invalid') });
                }
                this.bcrypt.hash(Request.body.newPassword, 10, async (errBcrypt, hash) => {
                        if (!errBcrypt) {
                                const filter = { "_id": user._id };
                                const update = { "password": hash, "resetPassToken": "" };
                                try {
                                        await this.User.updateOne(filter, update);
                                        Response.status(200).json({ msg: this.i18n.__('password_changed') });
                                } catch (error) {
                                        Response.status(500).json({ msg: error });
                                }

                        } else {
                                return res.status(500).send({ error: errBcrypt });
                        }
                });
        }

        validateEmail(email) {
                let emailPattern = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
                return emailPattern.test(email);
        }

        async sendVerificationMail(request, activationToken) {
                var bSentMail = false;
                const sHostUrl = request.protocol + '://' + request.get('host');
                const sActivationLink = sHostUrl + "/authentication/activate" + "?user=" + request.body.User + "&&activationToken=" + activationToken;
                this.mailerTransporter.sendMail({
                        text: this.i18n.__('verify_mail_text') + sActivationLink,
                        subject: this.i18n.__('verify_mail_subject'),
                        from: this.i18n.__('verify_mail_from'),
                        to: request.body.User
                }).then(info => {
                        bSentMail = true;
                }).catch(error => {
                        bSentMail = false;
                });
                return bSentMail;
        }

        async sendPassResetMail(request, resetPassToken) {
                var bSentMail = false;
                const sHostUrl = request.protocol + '://' + request.get('host');
                const sResetLink = sHostUrl + "/user/resetPass" + "?user=" + request.body.user + "&&resetPassToken=" + resetPassToken;
                this.mailerTransporter.sendMail({
                        text: this.i18n.__('reset_pass_mail_text') + sResetLink,
                        subject: this.i18n.__('reset_pass_mail_subject'),
                        from: this.i18n.__('reset_pass_mail_from'),
                        to: request.body.user
                }).then(info => {
                        bSentMail = true;
                }).catch(error => {
                        bSentMail = false;
                });
                return bSentMail;
        }

}

const userController = new UserController();
module.exports = userController;
