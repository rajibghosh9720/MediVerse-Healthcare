const express = require("express");
const app = express();
const ABI = require("./json/ABI.json");
const { Web3 } = require("web3");
const cors = require("cors");
const nodemailer = require("nodemailer");

app.use(cors());
app.use(express.json());
require("dotenv").config();

const web3 = new Web3(
  "https://distinguished-dimensional-tree.ethereum-sepolia.quiknode.pro/854c0dda4848ebfd261a9a5659eaa3d1898a9dfb/"
);

const contractAddress = "0x9D339F474fAacB6e524132b6bF84C08c6B50134E";
const contract = new web3.eth.Contract(ABI, contractAddress);

// Login endpoint
app.post("/authenticateHospital", async (req, res) => {
  const { hospitalId, password } = req.body;

  try {
    const response = await contract.methods
      .authenticateHospital(hospitalId, password)
      .call();

    const responseNumber = BigInt(response).toString();
    console.log(responseNumber);

    if (responseNumber === "1") {
      res.status(200).json({
        status: 200,
        message: "Valid Hospital Id and Password",
      });
    } else {
      res.status(400).json({
        status: 400,
        message: "Invalid Hospital Id and Password ",
      });
    }
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).send("An error occurred during authentication.");
  }
});

app.post("/isHospitalIdExistsByID", async (req, res) => {
  try {
    const { hospitalId } = req.body;

    const isHospitalPresent = await contract.methods
      .isHospitalIdExistsByID(hospitalId)
      .call();
    const check = Number(isHospitalPresent);
    console.log(check);
    if (check == 1) {
      res
        .status(400)
        .json({ status: 400, error: "Hospital Id already exists" });
    } else {
      res.status(200).json({
        status: 200,
        message: "Hospital Id is not already exists ",
      });
    }
  } catch (error) {
    console.error(error);
  }
});

app.post("/retreiveHospitalDetails", async (req, res) => {
  const { hospital_Id } = req.body;
  try {
    const hospitalDetails = await contract.methods
      .retreiveHospitalDetails(hospital_Id)
      .call();
    const {
      hospitalId,
      hospitalName,
      contactNumber,
      hospitalAddress,
      hospitalSpec,
      password,
    } = hospitalDetails;

    const numcontactNumber = Number(contactNumber);

    const HospitalDetails = {
      hospitalId,
      hospitalName,
      numcontactNumber,
      hospitalAddress,
      hospitalSpec,
      password,
    };

    res.status(200).json({ status: 200, HospitalDetails });
  } catch (error) {
    console.error("Error retrieving hospital details:", error);
    res
      .status(500)
      .send("An error occurred while retrieving hospital details.");
  }
});

app.post("/totalDoctorsUnderHospital", async (req, res) => {
  const { hospitalId } = req.body;
  try {
    const totalDoctors = await contract.methods
      .totalDoctorsUnderHospital(hospitalId)
      .call();
    const numTotalDoctors = parseInt(totalDoctors);
    res.status(200).json({ status: 200, totalDoctors: numTotalDoctors });
  } catch (error) {
    console.error("Error retrieving total doctors:", error);
    res.status(500).send("An error occurred while retrieving total doctors.");
  }
});

app.post("/totalPatientsUnderHospital", async (req, res) => {
  const { hospitalId } = req.body;
  try {
    const totalPatients = await contract.methods
      .totalPatientsUnderHospital(hospitalId)
      .call();
    const numTotalPatients = parseInt(totalPatients);
    res.status(200).json({ status: 200, totalPatients: numTotalPatients });
  } catch (error) {
    console.error("Error retrieving total patients:", error);
    res.status(500).send("An error occurred while retrieving total patients.");
  }
});

app.post("/totalPatientsUnderDoctor", async (req, res) => {
  const { doctorLicenseId } = req.body;
  try {
    const totalPatients = await contract.methods
      .totalPatientsUnderDoctor(doctorLicenseId)
      .call();
    const numTotalPatients = parseInt(totalPatients);
    res.status(200).json({ status: 200, totalPatients: numTotalPatients });
  } catch (error) {
    console.error("Error retrieving total patients under doctor:", error);
    res
      .status(500)
      .send("An error occurred while retrieving total patients under doctor.");
  }
});

// app.post("/retrieveDoctorsByHospitalId", async (req, res) => {
//   const { hospitalId } = req.body;
//   try {
//     const doctors = await contract.methods
//       .retrieveDoctorsByHospitalId(hospitalId)
//       .call();
//     res.status(200).json({ status: 200, doctors });
//   } catch (error) {
//     console.error("Error retrieving doctors:", error);
//     res.status(500).send("An error occurred while retrieving doctors.");
//   }
// });

// app.post("/retrievePatientsByHospitalId", async (req, res) => {
//   const { hospitalId } = req.body;
//   try {
//     const patients = await contract.methods
//       .retrievePatientsByHospitalId(hospitalId)
//       .call();
//     res.status(200).json({ status: 200, patients });
//   } catch (error) {
//     console.error("Error retrieving patients:", error);
//     res.status(500).send("An error occurred while retrieving patients.");
//   }
// });

app.post("/retrieveDoctorsByHospitalId", async (req, res) => {
  const { hospitalId } = req.body;
  try {
    const doctorIds = await contract.methods
      .retrieveDoctorsByHospitalId(hospitalId)
      .call();

    const doctors = [];
    for (const doctorId of doctorIds) {
      const doctorDetails = await contract.methods
        .retrieveDoctorDetails(doctorId)
        .call();
      const doctor = {
        doctorLicenseId: doctorDetails[0],
        doctorName: doctorDetails[1],
        doctorAddress: doctorDetails[2],
        doctorSpecialization: doctorDetails[3],
        doctorPhone: Number(doctorDetails[4]), // Convert to number
        hospitalId: doctorDetails[5],
        password: doctorDetails[6],
      };
      doctors.push(doctor);
    }

    res.status(200).json({ status: 200, doctors });
  } catch (error) {
    console.error("Error retrieving doctors:", error);
    res.status(500).send("An error occurred while retrieving doctors.");
  }
});

app.post("/retrievePatientsByHospitalId", async (req, res) => {
  const { hospitalId } = req.body;
  try {
    const patientIds = await contract.methods
      .retrievePatientsByHospitalId(hospitalId)
      .call();

    const patients = [];
    for (const patientId of patientIds) {
      const patientDetails = await contract.methods
        .retrievePatientDetails(patientId)
        .call();
      const patient = {
        patientId: patientDetails[0],
        hospitalId: patientDetails[1],
        doctorLicenseId: patientDetails[2],
        patientName: patientDetails[3],
        age: Number(patientDetails[4]),
        gender: patientDetails[5],
        patientAddress: patientDetails[6],
        patientPhone: Number(patientDetails[7]),
        medicalData: patientDetails[8],
        medicalReport: patientDetails[9],
        password: patientDetails[10],
      };
      patients.push(patient);
    }

    res.status(200).json({ status: 200, patients });
  } catch (error) {
    console.error("Error retrieving patients:", error);
    res.status(500).send("An error occurred while retrieving patients.");
  }
});

// app.post("/retrievePatientsByHospitalId", async (req, res) => {
//   const { hospitalId, page, pageSize } = req.body;
//   try {
//     const patientIds = await contract.methods
//       .retrievePatientsByHospitalId(hospitalId)
//       .call();

//     const totalPatients = patientIds.length;
//     const totalPages = Math.ceil(totalPatients / pageSize);

//     const startIndex = (page - 1) * pageSize;
//     const endIndex = Math.min(startIndex + pageSize, totalPatients);

//     const patients = [];
//     for (let i = startIndex; i < endIndex; i++) {
//       const patientId = patientIds[i];
//       const patientDetails = await contract.methods
//         .retrievePatientDetails(patientId)
//         .call();
//       const patient = {
//         patientId: patientDetails[0],
//         hospitalId: patientDetails[1],
//         doctorLicenseId: patientDetails[2],
//         patientName: patientDetails[3],
//         age: Number(patientDetails[4]),
//         gender: patientDetails[5],
//         patientAddress: patientDetails[6],
//         patientPhone: Number(patientDetails[7]),
//         medicalData: patientDetails[8],
//         password: patientDetails[9],
//       };
//       patients.push(patient);
//     }

//     res.status(200).json({
//       status: 200,
//       totalPages,
//       currentPage: page,
//       totalPatients,
//       patients,
//     });
//   } catch (error) {
//     console.error("Error retrieving patients:", error);
//     res.status(500).send("An error occurred while retrieving patients.");
//   }
// });

// Doctor
app.post("/authenticateDoctor", async (req, res) => {
  const { doctorLicenseId, password } = req.body;
  try {
    const response = await contract.methods
      .authenticateDoctor(doctorLicenseId, password)
      .call();

    const responseNumber = Number(response);
    console.log(responseNumber);

    if (responseNumber === 1) {
      res.status(200).json({
        status: 200,
        message: "Valid Doctor License Id and Password",
      });
    } else {
      res.status(400).json({
        status: 400,
        message: "Invalid Doctor License Id and Password ",
      });
    }
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).send("An error occurred during authentication.");
  }
});

app.post("/retrieveDoctorDetails", async (req, res) => {
  const { doctorLicenseId } = req.body;
  try {
    const doctorDetails = await contract.methods
      .retrieveDoctorDetails(doctorLicenseId)
      .call();
    const {
      doctorLicenseId: doctorId,
      doctorName,
      doctorAddress,
      doctorSpecialization,
      doctorPhone,
      hospitalId,
      password,
    } = doctorDetails;

    const numDoctorPhone = Number(doctorPhone);

    const doctorDetailsResponse = {
      doctorLicenseId: doctorId,
      doctorName,
      doctorAddress,
      doctorSpecialization,
      doctorPhone: numDoctorPhone,
      hospitalId,
      password,
    };

    res.status(200).json({ status: 200, doctorDetails: doctorDetailsResponse });
  } catch (error) {
    console.error("Error retrieving doctor details:", error);
    res.status(500).send("An error occurred while retrieving doctor details.");
  }
});

app.post("/isDoctorExistsByDoctorLicenseId", async (req, res) => {
  try {
    const { doctorLicenseId } = req.body;

    const isDoctorPresent = await contract.methods
      .isDoctorExistsByLicenseId(doctorLicenseId)
      .call();
    const check = Number(isDoctorPresent);
    console.log(check);
    if (check == 1) {
      res
        .status(400)
        .json({ status: 400, error: "Doctor License Id already exists" });
    } else {
      res.status(200).json({
        status: 200,
        message: "Doctor License Id is not already exists ",
      });
    }
  } catch (error) {
    console.error(error);
  }
});

app.post("/retrievePatientsByDoctorId", async (req, res) => {
  const { doctorLicenseId } = req.body;
  try {
    const patientIds = await contract.methods
      .retrievePatientsByDoctorId(doctorLicenseId)
      .call();

    const patients = [];
    for (const patientId of patientIds) {
      const patientDetails = await contract.methods
        .retrievePatientDetails(patientId)
        .call();
      const patient = {
        patientId: patientDetails[0],
        hospitalId: patientDetails[1],
        doctorLicenseId: patientDetails[2],
        patientName: patientDetails[3],
        age: Number(patientDetails[4]), // Convert to number
        gender: patientDetails[5],
        patientAddress: patientDetails[6],
        patientPhone: Number(patientDetails[7]), // Convert to number
        medicalData: patientDetails[8],
        medicalReport: patientDetails[9],
        password: patientDetails[10],
      };
      patients.push(patient);
    }

    res.status(200).json({ status: 200, patients });
  } catch (error) {
    console.error("Error retrieving patients:", error);
    res.status(500).send("An error occurred while retrieving patients.");
  }
});

// Patient
app.post("/authenticatePatient", async (req, res) => {
  const { patientId, password } = req.body;
  try {
    const response = await contract.methods
      .authenticatePatient(patientId, password)
      .call();

    const responseNumber = Number(response);

    if (responseNumber === 1) {
      res.status(200).json({
        status: 200,
        message: "Valid Patient Id and Password",
      });
    } else {
      res.status(400).json({
        status: 400,
        message: "Invalid Patient Id and Password ",
      });
    }
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).send("An error occurred during authentication.");
  }
});

app.post("/retrievePatientDetails", async (req, res) => {
  const { patientId } = req.body;
  try {
    const patientDetails = await contract.methods
      .retrievePatientDetails(patientId)
      .call();
    console.log(patientDetails);
    const {
      patientId: id,
      hospitalId,
      doctorLicenseId,
      patientName,
      age,
      gender,
      patientAddress,
      patientPhone,
      medicalData,
      medicalReport,
      password,
    } = patientDetails;

    const numAge = Number(age);
    const numPatientPhone = Number(patientPhone);

    const patientDetailsResponse = {
      patientId: id,
      hospitalId,
      doctorLicenseId,
      patientName,
      age: numAge,
      gender,
      patientAddress,
      patientPhone: numPatientPhone,
      medicalData,
      medicalReport,
      password,
    };

    res
      .status(200)
      .json({ status: 200, patientDetails: patientDetailsResponse });
  } catch (error) {
    console.error("Error retrieving patient details:", error);
    res.status(500).send("An error occurred while retrieving patient details.");
  }
});

app.post("/isPatientExistsByPatientId", async (req, res) => {
  try {
    const { patientId } = req.body;

    const isPatientPresent = await contract.methods
      .isPatientExistsByPatientId(patientId)
      .call();
    const check = Number(isPatientPresent);

    if (check == 1) {
      res.status(400).json({ status: 400, error: "Patient Id already exists" });
    } else {
      res.status(200).json({
        status: 200,
        message: "Patient Id does not already exist",
      });
    }
  } catch (error) {
    console.error(error);
  }
});

app.post("/isHospitalDoctorMatch", async (req, res) => {
  const { hospitalId, doctorLicenseId } = req.body;
  try {
    const isMatch = await contract.methods
      .isHospitalDoctorMatch(hospitalId, doctorLicenseId)
      .call();
    const check = Number(isMatch);
    if (check === 1) {
      res.status(200).json({
        status: 200,
        message: "Hospital and Doctor are matched.",
      });
    } else {
      res.status(400).json({
        status: 400,
        message: "Hospital and Doctor are not matched.",
      });
    }
  } catch (error) {
    console.error("Error checking hospital-doctor match:", error);
    res
      .status(500)
      .send("An error occurred while checking hospital-doctor match.");
  }
});

app.post("/send-mail", (req, res) => {
  const { email, subject, body } = req.body;

  const formattedBody = body.replace(/\n/g, "<br/>");

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
            body, html {
              margin: 0;
              padding: 0;
            }
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              background-color: #f4f4f4;
              text-align: center;
            }
            .container {
              max-width: 600px;
              margin: auto;
              padding: 20px;
              background-color: #fff;
              border-radius: 10px;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
              text-align: left; 
            }
            h1, h2, h3, h4, h5, h6 {
              margin-top: 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
          <img src="https://i.ibb.co/c8TVshW/Medi-Verse-Logo.png" alt="Logo" style="max-width: 15rem; display: block; margin: 0 auto;">
            <hr>
            <h2 style="text-align: center;">${subject}</h2>
            <p>${formattedBody}</p>
          </div>
        </body>
        </html>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.status(400).json({ status: 400, error: error });
      } else {
        res.status(201).json({
          status: 200,
          info: info.response,
          message: "Email sent successfully",
        });
      }
    });
  } catch (error) {
    res.status(500).json({ status: 500, error: error });
  }
});

app.use("/", (req, res) => {
  res.json({ message: "Welcome MediVerse API" });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
