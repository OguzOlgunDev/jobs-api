const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../errors");
const jobsSchema = require("../models/jobs");

const getAllJobs = async (req, res) => {
  const allJobs = await jobsSchema.find({ createdBy: req.user._id });

  res.json({ jobs: allJobs });
};
const getSingleJob = async (req, res) => {
  const {
    user: { _id: userID },
    params: { id: jobID },
  } = req;

  console.log(jobID, userID);

  const singleJob = await jobsSchema.findOne({ _id: jobID, createdBy: userID });
  if (!singleJob) {
    throw new CustomAPIError.BadRequestError("No single job");
  }

  res.json({ singleJob });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user._id;
  const job = await jobsSchema.create(req.body);
  res.json({ job });
};

const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { _id: userID },
    params: { id: jobID },
  } = req;

  if (!company && !position) {
    throw new CustomAPIError.BadRequestError(
      "Please provide a company or position"
    );
  }

  const singleUpdateJob = await jobsSchema.findByIdAndUpdate(
    {
      createdBy: userID,
      _id: jobID,
    },
    req.body,
    { new: true, runValidators: true }
  );

  res.json({ singleUpdateJob });
};

const deleteJob = async (req, res) => {
  const {
    user: { _id: userID },
    params: { id: jobID },
  } = req;

  const singleDeletedJob = await jobsSchema.findByIdAndDelete({
    _id: jobID,
    createdBy: userID,
  });

  if (!singleDeletedJob) {
    throw new CustomAPIError.BadRequestError("No job with this id");
  }

  res.status(StatusCodes.OK).send("Job is removed succesfuly");
};

module.exports = {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  getSingleJob,
};
