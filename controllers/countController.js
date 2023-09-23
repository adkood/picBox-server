const CountModel = require("../models/CountModel");

exports.createDocument = async (req, res) => {
  try {
    // Create a new document using the schema and provided data
    const data = new CountModel({
      downloadedPhotoIds: [],
      transactionPhotoIds: [],
    });

    // Save the new document to the database
    await data.save();

    res.json({ message: 'Document created successfully', document: data });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getCount = async (req, res) => {
  try {
    const data = await CountModel.findOne({});
    res.status(200).json({ status: "success", data });
  } catch (err) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.increaseDownloadCount = async (req, res) => {
  try {
    console.log("*");
    console.log(req.body);
    const { photoId } = req.body;
    if (!photoId) {
      return res.status(400).json({ error: "Invalid photo ID provided" });
    }
    const data = await CountModel.findOne({});
    data.downloadedPhotoIds.push(photoId);
    data.downloadCount += 1;
    await data.save();

  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.increaseTransactionCount = async (req, res) => {
  try {
    const { photoId } = req.body;
    if (!photoId) {
      return res.status(400).json({ error: "Invalid photo ID provided" });
    }
    const data = await CountModel.findOne({});
    data.transactionPhotoIds.push(photoId);
    data.transactionCount += 1;
    await data.save();
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.increasePostCount = async (req, res) => {
  try {
    const data = await CountModel.findOne({});
    data.numberOfImagesPosted += 1;
    await data.save();
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateBiggestTransaction = async (req, res) => {
  try {
    const { price, date } = req.body;
    const data = await CountModel.findOne({});
    const a = data.numberOfImagesPosted;
    data.biggestTransaction.value = Math.max(a, price);
    data.biggestTransaction.tDate = date;
    await data.save();
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// exports.addToDownloadedPhotoIds = async (req, res) => {
//   try {
//     const { photoId } = req.body;
//     if (!photoId) {
//       return res.status(400).json({ error: "Invalid photo ID provided" });
//     }
//     const data = await CountModel.findOne({});
//     data.downloadedPhotoIds.push(photoId);
//     await yourModelData.save();
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// exports.addToTransactionPhotoIds = async (req, res) => {
//   try {
//     const { photoId } = req.body;
//     if (!photoId) {
//       return res.status(400).json({ error: "Invalid photo ID provided" });
//     }
//     const data = await CountModel.findOne({});
//     data.transactionPhotoIds.push(photoId);
//     await data.save();
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
