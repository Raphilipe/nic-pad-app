class PersonController {

        constructor() {
                this.Person = require("../models/Person");
                this.i18n = require("../i18n");
        }

        async getPerson(Request, Response) {
                const people = await this.Person.find(Request.query);
                Response.send(people);
        }

        async createPerson(Request, Response) {
                if (!Request.body.name) {
                        return Response.status(422).json({ msg: this.i18n.__('name_is_required') });
                }
                if (!Request.body.cpf) {
                        return Response.status(422).json({ msg: this.i18n.__('cpf_is_required') });
                }
                const person = new this.Person({
                        name: Request.body.name,
                        cpf: Request.body.cpf,
                });
                try {
                        await person.save();
                        Response.status(201).json({ msg: this.i18n.__('person_created_successfully') });
                } catch (error) {
                        Response.status(500).json({ msg: error });
                }
        }

        async removePerson(Request, Response) {
                const person = new this.Person(Request.query);
                try {
                        await person.deleteOne(Request.query);
                        Response.status(201).json({ msg: this.i18n.__('person_deleted_successfully') });
                } catch (error) {
                        Response.status(500).json({ msg: error });
                }
        }

        async updatePerson(Request, Response) {
                if (!Request.body.name) {
                        return Response.status(422).json({ msg: this.i18n.__('name_is_required') });
                }
                if (!Request.body.cpf) {
                        return Response.status(422).json({ msg: this.i18n.__('cpf_is_required') });
                }
                const person = new this.Person(Request.body);
                try {
                        await person.updateOne(Request.body);
                        Response.status(201).json({ msg: this.i18n.__('person_updated_successfully') });
                } catch (error) {
                        Response.status(500).json({ msg: error });
                }
        }

}

const personController = new PersonController();
module.exports = personController;
