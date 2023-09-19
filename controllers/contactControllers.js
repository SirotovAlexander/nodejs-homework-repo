const contactsFolder = require("../models/contactsModel");
const {
  addSchema,
  updateSchema,
} = require("../utils/validation/contactValidationSchemas");

const getAll = async (req, res) => {
  const result = await contactsFolder.find();
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
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw new Error();
    }
    const result = await contactsFolder.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: "missing required name field" });
  }
};

const deleteContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const result = await contactsFolder.findByIdAndRemove(contactId);
    if (result === null) {
      throw new Error();
    }
    res.json(result);
  } catch (error) {
    res.status(404).json({ message: "Not found" });
  }
};

const updateContact = async (req, res) => {
  try {
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw new Error();
    }
    const { contactId } = req.params;
    const result = await contactsFolder.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });
    res.json(result);
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
    const result = await contactsFolder.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });
    res.json(result);
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
