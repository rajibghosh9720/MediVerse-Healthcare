// SPDX-License-Identifier: MIT

pragma solidity >=0.5.16;
pragma experimental ABIEncoderV2;

contract HealthCenter {
    uint256 public hospitalCount = 0;

    struct HospitalInfo {
        string hospitalId;
        string hospitalName;
        uint256 contactNumber;
        string hospitalAddress;
        string hospitalSpec;
        string password;
        string[] registeredDoctors;
        string[] registeredPatients;
    }

    struct DoctorInfo {
        string doctorLicenseId;
        string doctorName;
        string doctorAddress;
        string doctorSpecialization;
        uint256 doctorPhone;
        string hospitalId;
        string password;
        string[] registeredPatients;
    }

    struct PatientInfo {
        string patientId;
        string hospitalId;
        string doctorLicenseId;
        string patientName;
        uint256 age;
        string gender;
        string patientAddress;
        uint256 patientPhone;
        string medicalData;
        string[] medicalReport;
        string password;
    }

    mapping(string => HospitalInfo) hospitalsById;
    mapping(string => DoctorInfo) doctorsById;
    mapping(string => PatientInfo) patientsById;

    // Hospital

    function reg_Hospital(
        string memory _hospitalId,
        string memory _hospitalName,
        uint256 _contactNumber,
        string memory _hospitalAddress,
        string memory _hospitalSpec,
        string memory _password
    ) public {
        hospitalCount++;
        hospitalsById[_hospitalId] = HospitalInfo(
            _hospitalId,
            _hospitalName,
            _contactNumber,
            _hospitalAddress,
            _hospitalSpec,
            _password,
            new string[](0),
            new string[](0)
        );
    }

    function authenticateHospital(
        string memory _hospitalId,
        string memory _password
    ) public view returns (uint256) {
        HospitalInfo memory h = hospitalsById[_hospitalId];

        if (
            keccak256(abi.encodePacked(h.password)) ==
            keccak256(abi.encodePacked(_password))
        ) {
            return 1;
        } else {
            return 0;
        }
    }

    function updateHospitalDetails(
        string memory _hospitalId,
        string memory _newHospitalName,
        uint256 _newContactNumber,
        string memory _newHospitalAddress,
        string memory _newHospitalSpec
    ) public returns (uint256) {
        HospitalInfo storage hospital = hospitalsById[_hospitalId];

        require(
            bytes(hospital.hospitalId).length != 0,
            "Hospital does not exist"
        );

        hospital.hospitalName = _newHospitalName;
        hospital.contactNumber = _newContactNumber;
        hospital.hospitalAddress = _newHospitalAddress;
        hospital.hospitalSpec = _newHospitalSpec;

        hospitalsById[_hospitalId] = hospital;

        return 1;
    }

    function updateHospitalPassword(
        string memory _hospitalId,
        string memory _oldPassword,
        string memory _newPassword
    ) public returns (uint256) {
        HospitalInfo storage hospital = hospitalsById[_hospitalId];

        require(
            bytes(hospital.hospitalId).length != 0,
            "Hospital does not exist"
        );

        require(
            keccak256(abi.encodePacked(hospital.password)) ==
                keccak256(abi.encodePacked(_oldPassword)),
            "Old password does not match"
        );

        hospital.password = _newPassword;
        hospitalsById[_hospitalId] = hospital;

        return 1;
    }

    function retreiveHospitalDetails(
        string memory _hospitalId
    )
        public
        view
        returns (
            string memory hospitalId,
            string memory hospitalName,
            uint256 contactNumber,
            string memory hospitalAddress,
            string memory hospitalSpec,
            string memory password
        )
    {
        HospitalInfo memory h = hospitalsById[_hospitalId];
        return (
            h.hospitalId,
            h.hospitalName,
            h.contactNumber,
            h.hospitalAddress,
            h.hospitalSpec,
            h.password
        );
    }

    function retrieveDoctorDetails(
        string memory _doctorLicenseId
    )
        public
        view
        returns (
            string memory doctorLicenseId,
            string memory doctorName,
            string memory doctorAddress,
            string memory doctorSpecialization,
            uint256 doctorPhone,
            string memory hospitalId,
            string memory password
        )
    {
        DoctorInfo memory d = doctorsById[_doctorLicenseId];
        return (
            d.doctorLicenseId,
            d.doctorName,
            d.doctorAddress,
            d.doctorSpecialization,
            d.doctorPhone,
            d.hospitalId,
            d.password
        );
    }

    function retrievePatientDetails(
        string memory _patientId
    )
        public
        view
        returns (
            string memory patientId,
            string memory hospitalId,
            string memory doctorLicenseId,
            string memory patientName,
            uint256 age,
            string memory gender,
            string memory patientAddress,
            uint256 patientPhone,
            string memory medicalData,
            string[] memory medicalReport,
            string memory password
        )
    {
        PatientInfo memory p = patientsById[_patientId];
        return (
            p.patientId,
            p.hospitalId,
            p.doctorLicenseId,
            p.patientName,
            p.age,
            p.gender,
            p.patientAddress,
            p.patientPhone,
            p.medicalData,
            p.medicalReport,
            p.password
        );
    }

    function isHospitalIdExistsByID(
        string memory _hospitalId
    ) public view returns (uint256) {
        if (bytes(hospitalsById[_hospitalId].hospitalId).length != 0) {
            return 1;
        } else {
            return 0;
        }
    }

    function retrieveDoctorsByHospitalId(
        string memory _hospitalId
    ) public view returns (string[] memory) {
        require(
            bytes(hospitalsById[_hospitalId].hospitalId).length != 0,
            "Hospital does not exist"
        );

        return hospitalsById[_hospitalId].registeredDoctors;
    }

    function retrievePatientsByHospitalId(
        string memory _hospitalId
    ) public view returns (string[] memory) {
        require(
            bytes(hospitalsById[_hospitalId].hospitalId).length != 0,
            "Hospital does not exist"
        );

        return hospitalsById[_hospitalId].registeredPatients;
    }

    function totalDoctorsUnderHospital(
        string memory _hospitalId
    ) public view returns (uint256) {
        require(
            bytes(hospitalsById[_hospitalId].hospitalId).length != 0,
            "Hospital does not exist"
        );
        return hospitalsById[_hospitalId].registeredDoctors.length;
    }

    function totalPatientsUnderHospital(
        string memory _hospitalId
    ) public view returns (uint256) {
        require(
            bytes(hospitalsById[_hospitalId].hospitalId).length != 0,
            "Hospital does not exist"
        );
        return hospitalsById[_hospitalId].registeredPatients.length;
    }

    function totalPatientsUnderDoctor(
        string memory _doctorLicenseId
    ) public view returns (uint256) {
        require(
            bytes(doctorsById[_doctorLicenseId].doctorLicenseId).length != 0,
            "Doctor does not exist"
        );
        return doctorsById[_doctorLicenseId].registeredPatients.length;
    }

    // Doctor

    function reg_Doctor(
        string memory _doctorLicenseId,
        string memory _doctorName,
        string memory _doctorAddress,
        string memory _doctorSpecialization,
        uint256 _doctorPhone,
        string memory _hospitalId,
        string memory _password
    ) public {
        require(
            bytes(hospitalsById[_hospitalId].hospitalId).length != 0,
            "Hospital does not exist"
        );

        DoctorInfo memory newDoctor = DoctorInfo(
            _doctorLicenseId,
            _doctorName,
            _doctorAddress,
            _doctorSpecialization,
            _doctorPhone,
            _hospitalId,
            _password,
            new string[](0)
        );

        hospitalsById[_hospitalId].registeredDoctors.push(_doctorLicenseId);
        doctorsById[_doctorLicenseId] = newDoctor;
    }

    function authenticateDoctor(
        string memory _doctorLicenseId,
        string memory _password
    ) public view returns (uint256) {
        DoctorInfo memory d = doctorsById[_doctorLicenseId];

        if (
            keccak256(abi.encodePacked(d.password)) ==
            keccak256(abi.encodePacked(_password))
        ) {
            return 1;
        } else {
            return 0;
        }
    }

    function updateDoctorDetails(
        string memory _doctorLicenseId,
        string memory _newDoctorName,
        string memory _newDoctorAddress,
        string memory _newDoctorSpecialization,
        uint256 _newDoctorPhone
    ) public returns (uint256) {
        DoctorInfo storage doctor = doctorsById[_doctorLicenseId];

        require(
            bytes(doctor.doctorLicenseId).length != 0,
            "Doctor does not exist"
        );

        doctor.doctorName = _newDoctorName;
        doctor.doctorAddress = _newDoctorAddress;
        doctor.doctorSpecialization = _newDoctorSpecialization;
        doctor.doctorPhone = _newDoctorPhone;

        doctorsById[_doctorLicenseId] = doctor;

        return 1;
    }

    function updateDoctorHospitalId(
        string memory _doctorLicenseId,
        string memory _newHospitalId
    ) public returns (uint256) {
        DoctorInfo storage doctor = doctorsById[_doctorLicenseId];

        require(
            bytes(doctor.doctorLicenseId).length != 0,
            "Doctor does not exist"
        );

        require(
            bytes(hospitalsById[_newHospitalId].hospitalId).length != 0,
            "New hospital does not exist"
        );

        string memory oldHospitalId = doctor.hospitalId;
        HospitalInfo storage oldHospital = hospitalsById[oldHospitalId];
        for (uint256 i = 0; i < oldHospital.registeredDoctors.length; i++) {
            if (
                keccak256(abi.encodePacked(oldHospital.registeredDoctors[i])) ==
                keccak256(abi.encodePacked(_doctorLicenseId))
            ) {
                oldHospital.registeredDoctors[i] = oldHospital
                    .registeredDoctors[
                        oldHospital.registeredDoctors.length - 1
                    ];
                oldHospital.registeredDoctors.pop();
                break;
            }
        }

        doctor.hospitalId = _newHospitalId;

        hospitalsById[_newHospitalId].registeredDoctors.push(_doctorLicenseId);

        doctorsById[_doctorLicenseId] = doctor;

        return 1;
    }

    function updateDoctorPassword(
        string memory _doctorLicenseId,
        string memory _oldPassword,
        string memory _newPassword
    ) public returns (uint256) {
        DoctorInfo storage doctor = doctorsById[_doctorLicenseId];

        require(
            bytes(doctor.doctorLicenseId).length != 0,
            "Doctor does not exist"
        );

        require(
            keccak256(abi.encodePacked(doctor.password)) ==
                keccak256(abi.encodePacked(_oldPassword)),
            "Old password does not match"
        );

        doctor.password = _newPassword;
        doctorsById[_doctorLicenseId] = doctor;

        return 1;
    }

    function isDoctorExistsByLicenseId(
        string memory _doctorLicenseId
    ) public view returns (uint256) {
        if (bytes(doctorsById[_doctorLicenseId].doctorLicenseId).length != 0) {
            return 1;
        } else {
            return 0;
        }
    }

    function retrievePatientsByDoctorId(
        string memory _doctorLicenseId
    ) public view returns (string[] memory) {
        require(
            bytes(doctorsById[_doctorLicenseId].doctorLicenseId).length != 0,
            "Doctor does not exist"
        );

        return doctorsById[_doctorLicenseId].registeredPatients;
    }

    // Patient

    function reg_patient(
        string memory _patientId,
        string memory _hospitalId,
        string memory _doctorLicenseId,
        string memory _patientName,
        uint256 _age,
        string memory _gender,
        string memory _patientAddress,
        uint256 _patientPhone,
        string memory _medicalData,
        string[] memory _medicalReport,
        string memory _password
    ) public {
        require(
            bytes(hospitalsById[_hospitalId].hospitalId).length != 0,
            "Hospital does not exist"
        );

        require(
            bytes(doctorsById[_doctorLicenseId].doctorLicenseId).length != 0,
            "Doctor does not exist"
        );

        require(
            keccak256(
                abi.encodePacked(doctorsById[_doctorLicenseId].hospitalId)
            ) == keccak256(abi.encodePacked(_hospitalId)),
            "Doctor not associated with specified hospital"
        );

        PatientInfo memory newPatient = PatientInfo(
            _patientId,
            _hospitalId,
            _doctorLicenseId,
            _patientName,
            _age,
            _gender,
            _patientAddress,
            _patientPhone,
            _medicalData,
            _medicalReport,
            _password
        );

        hospitalsById[_hospitalId].registeredPatients.push(_patientId);
        doctorsById[_doctorLicenseId].registeredPatients.push(_patientId);
        patientsById[_patientId] = newPatient;
    }

    function authenticatePatient(
        string memory _patientId,
        string memory _password
    ) public view returns (uint256) {
        PatientInfo memory p = patientsById[_patientId];

        if (
            keccak256(abi.encodePacked(p.password)) ==
            keccak256(abi.encodePacked(_password))
        ) {
            return 1;
        } else {
            return 0;
        }
    }

    function updatePatientDetails(
        string memory _patientId,
        string memory _newPatientName,
        uint256 _newAge,
        string memory _newGender,
        string memory _newPatientAddress,
        uint256 _newPatientPhone,
        string memory _newMedicalData
    ) public returns (uint256) {
        PatientInfo storage patient = patientsById[_patientId];

        require(bytes(patient.patientId).length != 0, "Patient does not exist");

        patient.patientName = _newPatientName;
        patient.age = _newAge;
        patient.gender = _newGender;
        patient.patientAddress = _newPatientAddress;
        patient.patientPhone = _newPatientPhone;
        patient.medicalData = _newMedicalData;

        patientsById[_patientId] = patient;

        return 1;
    }

    function isPatientExistsByPatientId(
        string memory _patientId
    ) public view returns (uint256) {
        if (bytes(patientsById[_patientId].patientId).length != 0) {
            return 1;
        } else {
            return 0;
        }
    }

    function isHospitalDoctorMatch(
        string memory _hospitalId,
        string memory _doctorLicenseId
    ) public view returns (uint256) {
        if (
            bytes(hospitalsById[_hospitalId].hospitalId).length != 0 &&
            bytes(doctorsById[_doctorLicenseId].doctorLicenseId).length != 0
        ) {
            if (
                keccak256(
                    abi.encodePacked(doctorsById[_doctorLicenseId].hospitalId)
                ) == keccak256(abi.encodePacked(_hospitalId))
            ) {
                return 1;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }

    function medicalReportAddedPatient(
        string memory _patientId,
        string memory _medicalReport
    ) public returns (uint256) {
        require(
            bytes(patientsById[_patientId].patientId).length != 0,
            "Patient does not exist"
        );

        patientsById[_patientId].medicalReport.push(_medicalReport);

        return 1;
    }
}

// 0x9D339F474fAacB6e524132b6bF84C08c6B50134E
