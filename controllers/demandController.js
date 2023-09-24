const Demand = require("../models/DemandModel");

exports.createDemand = async (req, res) => {
  try {
    console.log(req.body);
    const data = new Demand(req.body);
    await data.save();

    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Could not create the request" });
  }
};

exports.updateDemand = async (req, res) => {
  const { demandId } = req.body;
  try {
    const data = await Demand.findById(demandId);

    if (!data) {
      return res.status(404).json({ error: "Data not found" });
    }

    data.isResolved = true;
    await data.save();

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Could not update !!!" });
  }
};

exports.getAllDemands = async (req, res) => {
  try {
    const data = await Demand.find();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Could not fetch demands" });
  }
};

exports.getResolvedDemands = async (req, res) => {
  try {
    const resolvedDemands = await Demand.find({ isResolved: true });
    return res.status(200).json(resolvedDemands);
  } catch (error) {
    return res.status(500).json({ error: "Could not fetch resolved demands" });
  }
};

exports.getUnresolvedDemands = async (req, res) => {
  try {
    const unresolvedDemands = await Demand.find({ isResolved: false });
    return res.status(200).json(unresolvedDemands);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Could not fetch unresolved demands" });
  }
};
