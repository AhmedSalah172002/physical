const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const User = require("../models/userModel");




// @desc    Add request to patient requests list
// @route   POST /api/v1/sendRequest
// @access  Private/patient
exports.sendRequest = asyncHandler(async (req, res, next) => {
    const { DoctorId } = req.body;
    const doctor = await User.findById(DoctorId);

    if(doctor) {
        let request = await User.findById(req.user._id)

        let requestsSended = request.requests.find((e) => e.doc.toString() == DoctorId.toString())
        let Doctors = request.doctors.find((e) => e.doc.toString() == DoctorId.toString())

        if(requestsSended || Doctors){
            return next(new ApiError(`You already send request to ${DoctorId}`, 404));
        
        }else{
            const send = await User.findByIdAndUpdate(
                req.user._id,
                {
                  $addToSet: { requests: {doc: DoctorId} },
                },
                { new: true }
              );
              const recieve = await User.findByIdAndUpdate(
                DoctorId,
                {
                  $addToSet: { recives: {patient: req.user._id} },
                },
                { new: true }
              );


              res.status(200).json({
                  status: 'success',
                  message: 'Request sended successfully.',
                });
            }
    }    
  });


// @desc    accept patients requests
// @route   POST /api/v1/accept/:patientId
// @access  Private/doctor
exports.acceptRequest = asyncHandler(async (req, res, next) => {
    const { patientId } = req.params;
    const patient = await User.findById(patientId)

    if(patientId) {
            // add patient and doctor
            const patients = await User.findByIdAndUpdate(
                req.user._id,
                {
                  $addToSet: { patients: {patient: patientId} },
                },
                { new: true }
              );
              const doctors = await User.findByIdAndUpdate(
                patientId,
                {
                  $addToSet: { doctors: {doc: req.user._id} },
                },
                { new: true }
              );

              //remove request and recieve
              const send = await User.findByIdAndUpdate(
                patientId,
                {
                  $pull: { requests: {doc: req.user._id} },
                },
                { new: true }
              );
              const recieve = await User.findByIdAndUpdate(
                req.user._id,
                {
                    $pull: { recives: {patient: patientId} },
                },
                { new: true }
              );



              res.status(200).json({
                  status: 'success',
                  message: 'Accept request successfully.',
                });
            }
       
  });





// @desc    reject patients requests
// @route   POST /api/v1/reject/:patientId
// @access  Private/doctor
exports.rejectRequest = asyncHandler(async (req, res, next) => {
  const { patientId } = req.params;
  const patient = await User.findById(patientId)

  if(patientId) {
            const send = await User.findByIdAndUpdate(
              patientId,
              {
                $pull: { requests: {doc: req.user._id} },
              },
              { new: true }
            );
            const recieve = await User.findByIdAndUpdate(
              req.user._id,
              {
                  $pull: { recives: {patient: patientId} },
              },
              { new: true }
            );



            res.status(200).json({
                status: 'success',
                message: 'Reject request successfully.',
              });
          }
     
});