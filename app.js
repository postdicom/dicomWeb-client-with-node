const readline = require('readline');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { Buffer } = require('buffer');
const https = require('https');
const FormData = require('form-data');

const userName = "your PostDICOM user name";
const password = "your PostDICOM password";
const webAddress = "PostDICOM DicomWeb server Address";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

console.log('Choose an option:')
console.log('1) Upload DICOM Images in a folder')
console.log('2) QIDO Search')
console.log('3) WadoRS Retrieve Images')
console.log('4) Create share link')
console.log('5) Share patient order with URL')
console.log('6) Create folder')
console.log('7) Search folder')
console.log('8) Share folder with URL')
console.log('9) Add order to folder')
console.log('10) Assign order to user')
console.log('11) Assign order to user group')
console.log('12) Create patient order')
console.log('0) Exit')

rl.question('\r\nSelect an option: ', async (option) => {
    run(option);
});

function run(processType) {
    switch (processType) {
        case "1":
            UploadDicomImagesInAFolder();
            return true;
        case "2":
            QidoSearch();
            return true;
        case "3":
            RetrieveImagesUsingWadoRs();
            return true;
        case "4":
            CreateShareLink();
            return true;
        case "5":
            SharePatientOrderWithUrl();
            return true;
        case "6":
            CreateFolder();
            return true;
        case "7":
            SearchFolder();
            return true;
        case "8":
            ShareFolderWithUrl();
            return true;
        case "9":
            AddOrderToFolder();
            return true;
        case "10":
            AssignOrderToUser();
            return true;
        case "11":
            AssignOrderToUserGroup();
            return true;
        case "12":
            CreatePatientOrder();
            return true;
        default:
            return true;
    }
}

//#region Upload Images to DicomWeb Server
function UploadDicomImagesInAFolder() {
    console.log("Not ready yet!")
}

//#endregion

//#region Query DICOM Objects
async function QidoSearch() {
    var qidoSearchParameter = "";
    var level = "";

    console.clear();
    console.log("Choose an option:");
    console.log("1) SearchStudies-using-PatientID");
    console.log("2) SearchStudies-using-StudyInstanceUID");
    console.log("3) SearchSeries-using-StudyInstanceUID");
    console.log("4) SearchImages-using-SeriesInstanceUID");
    console.log("5) Exit");

    rl.question('\r\nSelect an option: ', async (option) => {
        switch (option) {
            case "1":
                level = "SearchStudies-using-PatientID";
                console.log("1) SearchStudies-using-PatientID is selected.")
                rl.question('Please enter PatientID: ', async (qidoSearchParameter) => {
                    if (qidoSearchParameter == "") {
                        qidoSearchParameter = "22222222222";
                    }
                    var url = webAddress + "studies?00100020=" + qidoSearchParameter;
                    console.log("SearchStudies-using-PatientID. URL = " + url);

                    await SearchDicomWebServer(url);
                    rl.close();
                });
                return;

            case "2":
                level = "SearchStudies-using-StudyInstanceUID";
                console.log("2) SearchStudies-using-StudyInstanceUID is selected.")
                rl.question('Please enter StudyInstanceUID: ', async (qidoSearchParameter) => {
                    var url = webAddress + "studies?0020000D=" + qidoSearchParameter;
                    console.log("SearchStudies-using-StudyInstanceUID. URL = " + url);

                    await SearchDicomWebServer(url);
                    rl.close();
                });
                return;

            case "3":
                level = "SearchSeries-using-StudyInstanceUID";
                console.log("3) SearchSeries-using-StudyInstanceUID is selected.")
                rl.question('Please enter StudyInstanceUID: ', async (qidoSearchParameter) => {
                    var url = webAddress + "studies/series?0020000D=" + qidoSearchParameter;
                    console.log("SearchSeries-using-StudyInstanceUID. URL = " + url);

                    await SearchDicomWebServer(url);
                    rl.close();
                });
                return;

            case "4":
                level = "SearchImages-using-SeriesInstanceUID";
                console.log("4) SearchImages-using-SeriesInstanceUID is selected.")
                rl.question('Please enter SeriesInstanceUID: ', async (qidoSearchParameter) => {
                    var url = webAddress + "studies/series/instances?0020000E=" + qidoSearchParameter;
                    console.log("SearchImages-using-SeriesInstanceUID. URL = " + url);

                    await SearchDicomWebServer(url);
                    rl.close();
                });
                return;

            default:
                return;
        }
    });
}

async function SearchDicomWebServer(url) {
    try {
        const auth = Buffer.from(`${userName}:${password}`).toString('base64');
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`
            }
        });

        console.log('HttpResponseMessage.StatusCode = ' + response.status);
        console.log('Response text =\n' + JSON.stringify(response.data));
    } catch (error) {
        console.error('Error while multicontent.\nReason = ' + error.message);
        if (error.response && error.response.data) {
            console.error('Response data = ' + JSON.stringify(error.response.data));
        }
    }
    console.log('QidoSearch method finished. Press Enter to continue.');
}
//#endregion

//#region Retrieve Images Using WadoRS
async function RetrieveImagesUsingWadoRs() {
    var wadoSearchParameter = "";
    var level = "";

    console.clear();
    console.log("Choose an option:");
    console.log("1) RetrieveImages-using-StudyInstanceUID");
    console.log("2) RetrieveImages-using-SeriesInstanceUID");
    console.log("3) RetrieveImages-using-SOPInstanceUID");
    console.log("4) Exit");

    rl.question('\r\nSelect an option: ', async (option) => {
        switch (option) {
            case "1":
                level = "RetrieveImages-using-StudyInstanceUID";
                console.log("1) RetrieveImages-using-StudyInstanceUID is selected.")
                rl.question('Please enter StudyInstanceUID: ', async (wadoSearchParameter) => {
                   
                    var url = webAddress + "studies/" + wadoSearchParameter;
                    console.log("SearchStudies-using-PatientID. URL = " + url);

                    await RetrieveAndSaveImages(url);
                    rl.close();
                });
                return;

            case "2":
                level = "RetrieveImages-using-SeriesInstanceUID";
                console.log("1) RetrieveImages-using-SeriesInstanceUID is selected.")
                rl.question('Please enter SeriesInstanceUID: ', async (wadoSearchParameter) => {

                    var url = webAddress + "studies/series/" + wadoSearchParameter;
                    console.log("SearchStudies-using-SeriesInstanceUID. URL = " + url);

                    await RetrieveAndSaveImages(url);
                    rl.close();
                });
                return;

            case "1":
                level = "RetrieveImages-using-SOPInstanceUID";
                console.log("1) RetrieveImages-using-SOPInstanceUID is selected.")
                rl.question('Please enter SOPInstanceUID: ', async (wadoSearchParameter) => {

                    var url = webAddress + "studies/series/instances/" + wadoSearchParameter;
                    console.log("SearchSeries-using-SOPInstanceUID. URL = " + url);

                    await RetrieveAndSaveImages(url);
                    rl.close();
                });
                return;

            default:
                return;
        }
    });
}

async function RetrieveAndSaveImages(url) {
    try {
        const auth = Buffer.from(`${userName}:${password}`).toString('base64');
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`
            }
        });

        console.log('HttpResponseMessage.StatusCode = ' + response.status);
        console.log('Response text =\n' + JSON.stringify(response.data));
    } catch (error) {
        console.error('Error while multicontent.\nReason = ' + error.message);
        if (error.response && error.response.data) {
            console.error('Response data = ' + JSON.stringify(error.response.data));
        }
    }
    console.log('QidoSearch method finished. Press Enter to continue.');
}
//#endregion

//#region Create Share Link
async function CreateShareLink() {
    console.clear();
    rl.question('Please enter PatientOrderUuid: ', async (patientOrderUuid) => {
        rl.question('Please enter ExpireDate(YYYY-MM-DD): ', async (expireDate) => {
            rl.question('Please enter SharePassword: ', async (password) => {
                const isDownloadable = false;
                await CreateShareLinkInternal([patientOrderUuid], expireDate, password, isDownloadable);
                rl.close();
            });
        });
    });
}

async function CreateShareLinkInternal(patientOrderUuidList, expireDate, sharePassword, isDownloadable) {
    const patientOrderInfoList = patientOrderUuidList.map(patientOrderUuid => {
        return JSON.stringify({ PatientOrderUuid: patientOrderUuid });
    });

    const parameterDictionary = {
        PatientOrderInfoList: JSON.stringify(patientOrderInfoList),
        ExpireDate: expireDate,
        SharePassword: sharePassword,
        Downloadable: isDownloadable.toString()
    };

    const url = webAddress + "/createsharelink";
    await CreateShareLinkDicomWebServer(url, parameterDictionary);
}

async function CreateShareLinkDicomWebServer(url, parameterDictionary) {
    try {
        const auth = Buffer.from(`${userName}:${password}`).toString('base64');
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`,
                'ShareParameters': JSON.stringify(parameterDictionary)
            }
        });

        console.log('HttpResponseMessage.StatusCode = ' + response.status);
        console.log('Response text =\n' + JSON.stringify(response.data));
    } catch (error) {
        console.error('Error while multicontent.\nReason = ' + error.message);
        if (error.response && error.response.data) {
            console.error('Response data = ' + JSON.stringify(error.response.data));
        }
    }
    console.log('QidoSearch method finished. Press Enter to continue.');
}
//#endregion

//#region Share Patient Order With URL
async function SharePatientOrderWithUrl() {
    console.clear();
    rl.question('Please enter PatientOrderUuid: ', async (patientOrderUuid) => {
        rl.question('Please enter ExpireDate(YYYY-MM-DD): ', async (expireDate) => {
            rl.question('Please enter SharePassword: ', async (password) => {
                rl.question('Please enter GetOrdersInFolder(true or false): ', async (userCanDownloadStudies) => {
                    await SharePatientOrderWithUrlInternal([patientOrderUuid], expireDate, password, userCanDownloadStudies);
                    rl.close();
                });
            });
        });
    });
}

async function SharePatientOrderWithUrlInternal(patientOrderUuidList, expireDate, sharePassword, userCanDownloadStudies) {
    const parameterDictionary = {
        OrderUuidList: JSON.stringify(patientOrderUuidList),
        ExpireDate: expireDate,
        SharePassword: sharePassword,
        UserCanDownloadStudies: userCanDownloadStudies.toString()
    };

    const url = webAddress + "/sharepatientorderwithurl";
    await SharePatientOrderWithUrlDicomWebServer(url, parameterDictionary);
}

async function SharePatientOrderWithUrlDicomWebServer(url, parameterDictionary) {
    try {
        const auth = Buffer.from(`${userName}:${password}`).toString('base64');
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`,
                'SharePatientOrderParameters': JSON.stringify(parameterDictionary)
            }
        });

        console.log('HttpResponseMessage.StatusCode = ' + response.status);
        console.log('Response text =\n' + JSON.stringify(response.data));
    } catch (error) {
        console.error('Error while multicontent.\nReason = ' + error.message);
        if (error.response && error.response.data) {
            console.error('Response data = ' + JSON.stringify(error.response.data));
        }
    }
    console.log('QidoSearch method finished. Press Enter to continue.');
}
//#endregion

//#region Create Folder
async function CreateFolder() {
    console.clear();
    rl.question('Please enter FolderName: ', async (folderName) => {
        rl.question('Please enter FolderDescription: ', async (folderDescription) => {
            rl.question('Please enter ParentFolderUuid: ', async (parentFolderUuid) => {
                await CreateFolderInternal(folderName, folderDescription, parentFolderUuid);
                rl.close();
            });
        });
    });
}

async function CreateFolderInternal(folderName, folderDescription, parentFolderUuid) {
    const parameterDictionary = {
        FolderName: folderName,
        FolderDescription: folderDescription,
        ParentFolderUuid: parentFolderUuid
    };

    const url = webAddress + "/createfolder";
    await CreateFolderDicomWebServer(url, parameterDictionary);
}

async function CreateFolderDicomWebServer(url, parameterDictionary) {
    try {
        const auth = Buffer.from(`${userName}:${password}`).toString('base64');
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`,
                'CreateFolderParameters': JSON.stringify(parameterDictionary)
            }
        });

        console.log('HttpResponseMessage.StatusCode = ' + response.status);
        console.log('Response text =\n' + JSON.stringify(response.data));
    } catch (error) {
        console.error('Error while multicontent.\nReason = ' + error.message);
        if (error.response && error.response.data) {
            console.error('Response data = ' + JSON.stringify(error.response.data));
        }
    }
    console.log('QidoSearch method finished. Press Enter to continue.');
}
//#endregion

//#region Search Folder
async function SearchFolder() {
    console.clear();
    rl.question('Please enter ParentFolderUuid: ', async (parentFolderUuid) => {
        rl.question('Please enter FolderName: ', async (folderName) => {
            rl.question('Please enter GetOrdersInFolder(true or false): ', async (getOrdersInFolder) => {
                await SearchFolderInternal(parentFolderUuid, folderName, getOrdersInFolder);
                rl.close();
            });
        });
    });
}

async function SearchFolderInternal(parentFolderUuid, folderName, getOrdersInFolder) {
    const parameterDictionary = {
        ParentFolderUuid: parentFolderUuid,
        FolderName: folderName,
        GetOrdersInFolder: getOrdersInFolder
    };

    const url = webAddress + "/searchfolder";
    await SearchFolderDicomWebServer(url, parameterDictionary);
}

async function SearchFolderDicomWebServer(url, parameterDictionary) {
    try {
        const auth = Buffer.from(`${userName}:${password}`).toString('base64');
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`,
                'SearchFolderParameters': JSON.stringify(parameterDictionary)
            }
        });

        console.log('HttpResponseMessage.StatusCode = ' + response.status);
        console.log('Response text =\n' + JSON.stringify(response.data));
    } catch (error) {
        console.error('Error while multicontent.\nReason = ' + error.message);
        if (error.response && error.response.data) {
            console.error('Response data = ' + JSON.stringify(error.response.data));
        }
    }
    console.log('QidoSearch method finished. Press Enter to continue.');
}
//#endregion

//#region Share Folder With URL
async function ShareFolderWithUrl() {
    console.clear();
    rl.question('Please enter FolderUuid: ', async (folderUuid) => {
        rl.question('Please enter SharePassword: ', async (sharePassword) => {
            rl.question('Please enter ShareTitle: ', async (shareTitle) => {
                rl.question('Please enter ShareDescription: ', async (shareDescription) => {
                    rl.question('Please enter ExpireDate(YYYY-MM-DD): ', async (expireDate) => {
                        rl.question('Please enter UserCanDownloadStudies(true or false): ', async (userCanDownloadStudies) => {
                            await ShareFolderWithUrlInternal(folderUuid, sharePassword, shareTitle, shareDescription, expireDate, userCanDownloadStudies);
                            rl.close();
                        });
                    });
                });
            });
        });
    });
}

async function ShareFolderWithUrlInternal(folderUuid, sharePassword, shareTitle, shareDescription, expireDate, userCanDownloadStudies) {
    const parameterDictionary = {
        FolderUuid: folderUuid,
        SharePassword: sharePassword,
        ShareTitle: shareTitle,
        ShareDescription: shareDescription,
        ExpireDate: expireDate,
        UserCanDownloadStudies: userCanDownloadStudies
    };

    const url = webAddress + "/sharefolderwithurl";
    await ShareFolderWithUrlDicomWebServer(url, parameterDictionary);
}

async function ShareFolderWithUrlDicomWebServer(url, parameterDictionary) {
    try {
        const auth = Buffer.from(`${userName}:${password}`).toString('base64');
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`,
                'ShareFolderParameters': JSON.stringify(parameterDictionary)
            }
        });

        console.log('HttpResponseMessage.StatusCode = ' + response.status);
        console.log('Response text =\n' + JSON.stringify(response.data));
    } catch (error) {
        console.error('Error while multicontent.\nReason = ' + error.message);
        if (error.response && error.response.data) {
            console.error('Response data = ' + JSON.stringify(error.response.data));
        }
    }
    console.log('QidoSearch method finished. Press Enter to continue.');
}
//#endregion

//#region Add Order to Folder
async function AddOrderToFolder() {
    console.clear();
    rl.question('Please enter PatientOrderUuid: ', async (patientOrderUuid) => {
        rl.question('Please enter FolderUuid: ', async (folderUuid) => {
            await AddOrderToFolderInternal(patientOrderUuid, [folderUuid]);
        });
    });
}

async function AddOrderToFolderInternal(patientOrderUuid, folderUuidList) {
    const parameterDictionary = {
        PatientOrderUuid: patientOrderUuid,
        FolderUuidList: JSON.stringify(folderUuidList)
    };

    const url = webAddress + "/addordertofolder";
    await AddOrderToFolderDicomWebServer(url, parameterDictionary);
}

async function AddOrderToFolderDicomWebServer(url, parameterDictionary) {
    try {
        const auth = Buffer.from(`${userName}:${password}`).toString('base64');
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`,
                'AddOrderToFolderParameters': JSON.stringify(parameterDictionary)
            }
        });

        console.log('HttpResponseMessage.StatusCode = ' + response.status);
        console.log('Response text =\n' + JSON.stringify(response.data));
    } catch (error) {
        console.error('Error while multicontent.\nReason = ' + error.message);
        if (error.response && error.response.data) {
            console.error('Response data = ' + JSON.stringify(error.response.data));
        }
    }
    console.log('QidoSearch method finished. Press Enter to continue.');
}
//#endregion

//#region Assign Order to User
async function AssignOrderToUser() {
    console.clear();
    rl.question('Please enter PatientOrderUuid: ', async (patientOrderUuid) => {
        rl.question('Please enter AssignedUserUuid: ', async (assignedUserUuid) => {
            await AssignOrderToUserInternal(patientOrderUuid, assignedUserUuid);
            rl.close();
        });
    });
}

async function AssignOrderToUserInternal(patientOrderUuid, assignedUserUuid) {
    const parameterDictionary = {
        PatientOrderUuid: patientOrderUuid,
        AssignedUserUuid: assignedUserUuid
    };

    const url = webAddress + "/assignordertouser";
    await AssignOrderToUserDicomWebServer(url, parameterDictionary);
}

async function AssignOrderToUserDicomWebServer(url, parameterDictionary) {
    try {
        const auth = Buffer.from(`${userName}:${password}`).toString('base64');
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`,
                'AssignOrderToUserParameters': JSON.stringify(parameterDictionary)
            }
        });

        console.log('HttpResponseMessage.StatusCode = ' + response.status);
        console.log('Response text =\n' + JSON.stringify(response.data));
    } catch (error) {
        console.error('Error while multicontent.\nReason = ' + error.message);
        if (error.response && error.response.data) {
            console.error('Response data = ' + JSON.stringify(error.response.data));
        }
    }
    console.log('QidoSearch method finished. Press Enter to continue.');
}
//#endregion

//#region Assign Order to User Group
async function AssignOrderToUserGroup() {
    console.clear();
    rl.question('Please enter PatientOrderUuid: ', async (patientOrderUuid) => {
        rl.question('Please enter AssignedUserGroupUuid: ', async (assignedUserGroupUuid) => {
            await AssignOrderToUserGroupInternal(patientOrderUuid, assignedUserGroupUuid);
            rl.close();
        });
    });
}

async function AssignOrderToUserGroupInternal(patientOrderUuid, assignedUserGroupUuid) {
    const parameterDictionary = {
        PatientOrderUuid: patientOrderUuid,
        AssignedUserGroupUuid: assignedUserGroupUuid
    };

    const url = webAddress + "/assignordertousergroup";
    await AssignOrderToUserGroupDicomWebServer(url, parameterDictionary);
}

async function AssignOrderToUserGroupDicomWebServer(url, parameterDictionary) {
    try {
        const auth = Buffer.from(`${userName}:${password}`).toString('base64');
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`,
                'AssignOrderToUserGroupParameters': JSON.stringify(parameterDictionary)
            }
        });

        console.log('HttpResponseMessage.StatusCode = ' + response.status);
        console.log('Response text =\n' + JSON.stringify(response.data));
    } catch (error) {
        console.error('Error while multicontent.\nReason = ' + error.message);
        if (error.response && error.response.data) {
            console.error('Response data = ' + JSON.stringify(error.response.data));
        }
    }
    console.log('QidoSearch method finished. Press Enter to continue.');
}
//#endregion

//#region Create Patient Order
async function CreatePatientOrder() {
    console.clear();
    rl.question('Please enter InstitutionUuid(*required): ', async (institutionUuid) => {//required parameter
        rl.question('Please enter PatientName(*required): ', async (patientName) => {//required parameter
            rl.question('Please enter PatientId(*required): ', async (patientId) => {//required parameter
                rl.question('Please enter OtherPatientId: ', async (otherPatientId) => {
                    rl.question('Please enter PatientSex: ', async (patientSex) => {
                        rl.question('Please enter PatientBirthdate(*required)(format: YYYY-MM-DD): ', async (patientBirthdate) => {//required parameter
                            rl.question('Please enter Modality(*required): ', async (modality) => {//required parameter
                                rl.question('Please enter StudyDescription: ', async (studyDescription) => {
                                    rl.question('Please enter AccessionNumber: ', async (accessionNumber) => {
                                        rl.question('Please enter PatientComplaints: ', async (patientComplaints) => {
                                            rl.question('Please enter OrderScheduledDatetime(YYYY-MM-DD HH:MM): ', async (scheduleStartDate) => {
                                                rl.question('Please enter RequestedProcedureId: ', async (requestedProcedureId) => {
                                                    rl.question('Please enter RequestedProcedureDescription: ', async (requestedProcedureDescription) => {
                                                        rl.question('Please enter RequestingPhysician: ', async (requestingPhysician) => {
                                                            rl.question('Please enter ReferringPhysiciansName: ', async (referringPhysiciansName) => {
                                                                rl.question('Please enter ScheduledEquipmentUuid: ', async (scheduledEquipmentUuid) => {
                                                                    await CreatePatientOrderInternal(institutionUuid, patientName, patientId, otherPatientId, patientSex, patientBirthdate, modality, studyDescription, accessionNumber, patientComplaints, scheduleStartDate, requestedProcedureId, requestedProcedureDescription, requestingPhysician, referringPhysiciansName, scheduledEquipmentUuid);
                                                                    rl.close();
                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

async function CreatePatientOrderInternal(institutionUuid, patientName, patientId, otherPatientId, patientSex, patientBirthdate, modality, studyDescription, accessionNumber, patientComplaints, scheduleStartDate, requestedProcedureId, requestedProcedureDescription, requestingPhysician, referringPhysiciansName, scheduledEquipmentUuid) {
    const parameterDictionary = {
        InstitutionUuid: institutionUuid,
        PatientName: patientName,
        PatientId: patientId,
        OtherPatientId: otherPatientId,
        PatientSex: patientSex,
        PatientBirthdate: patientBirthdate,
        Modality: modality,
        StudyDescription: studyDescription,
        AccessionNumber: accessionNumber,
        PatientComplaints: patientComplaints,
        OrderScheduledDatetime: scheduleStartDate,
        RequestedProcedureId: requestedProcedureId,
        RequestedProcedureDescription: requestedProcedureDescription,
        RequestingPhysician: requestingPhysician,
        ReferringPhysiciansName: referringPhysiciansName,
        ScheduledEquipmentUuid: scheduledEquipmentUuid
    };

    const url = webAddress + "/createpatientorder";
    await CreatePatientOrderDicomWebServer(url, parameterDictionary);
}

async function CreatePatientOrderDicomWebServer(url, parameterDictionary) {
    try {
        const auth = Buffer.from(`${userName}:${password}`).toString('base64');
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`,
                'CreatePatientOrderParameters': JSON.stringify(parameterDictionary)
            }
        });

        console.log('HttpResponseMessage.StatusCode = ' + response.status);
        console.log('Response text =\n' + JSON.stringify(response.data));
    } catch (error) {
        console.error('Error while multicontent.\nReason = ' + error.message);
        if (error.response && error.response.data) {
            console.error('Response data = ' + JSON.stringify(error.response.data));
        }
    }
    console.log('QidoSearch method finished. Press Enter to continue.');
}
//#endregion