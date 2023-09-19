const contactsFolder = require("../models/contactsModel");
const {
  addContactValidationSchema,
  updateSchema,
} = require("../utils/validation/contactValidationSchemas");

const getAll = async (req, res) => {
  const contacts = await contactsFolder.find();
  res.json(result);
};

const getByID = async (req, res) => {
  try {
    const { contactId } = req.params;
    const contact = await contactsFolder.findById(contactId);
    if (!contact) {
      throw new Error();
    }
    res.json(contact);
  } catch (error) {
    res.status(404).json({ message: "Not found" });
  }
};

const addContact = async (req, res) => {
  try {
    const { error } = addContactValidationSchema.validate(req.body);
    if (error) {
      throw new Error();
    }
    const contact = await contactsFolder.create(req.body);
    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ message: "missing required name field" });
  }
};

const deleteContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const contact = await contactsFolder.findByIdAndRemove(contactId);
    if (!contact) {
      throw new Error();
    }
    res.json(contact);
  } catch (error) {
    res.status(404).json({ message: "Not found" });
  }
};

const updateContact = async (req, res) => {
  try {
    const { error } = addContactValidationSchema.validate(req.body);
    if (error) {
      throw new Error();
    }
    const { contactId } = req.params;
    const contact = await contactsFolder.findByIdAndUpdate(
      contactId,
      req.body,
      {
        new: true,
      }
    );
    res.json(contact);
  } catch (error) {
    res.status(400).json({ message: "missing fields" });
  }
};

const updateStatusContact = async (req, res) => {
  try {
    const { error } = updateSchema.validate(req.body);
    if (error) {
      throw new Error();
    }
    const { contactId } = req.params;
    const contact = await contactsFolder.findByIdAndUpdate(
      contactId,
      req.body,
      {
        new: true,
      }
    );
    res.json(contact);
  } catch (error) {
    res.status(400).json({ message: "missing field favorite" });
  }
};

module.exports = {
  getAll: getAll,
  getByID: getByID,
  addContact: addContact,
  deleteContact: deleteContact,
  updateContact: updateContact,
  updateStatusContact: updateStatusContact,
};
