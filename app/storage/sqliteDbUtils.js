import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {
    name: 'mydb.db', // Tên cơ sở dữ liệu
    location: 'default', // Vị trí lưu trữ
  },
  () => {
    console.log('Database opened successfully');
    createTables();
  },
  error => {
    console.log('Error opening database: ', error);
  }
);



function getCurrentDateTime() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Tháng từ 0-11
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${hours}:${minutes}:${seconds} ${day}-${month}-${year}`;
}

function createTables() {
  db.transaction(tx => {
    tx.executeSql('PRAGMA foreign_keys = ON;', [],
      () => console.log('Foreign keys enabled'),
      error => console.log('Error enabling foreign keys:', error)
    );
    executeCreateVehicleTable(tx);
    executeCreateViolationTable(tx);
    executeCreateSettlementTable(tx);
    executeCreateLocationHistoryTable(tx);

  })
};


function executeCreateLocationHistoryTable(tx) {
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS LocationHistory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      locationLat TEXT,
      locationLong TEXT,
      totalDistance TEXT,    
      totalTime TEXT,
      time TEXT
    );`,
    [],
    () => console.log('Table LocationHistory created successfully'),
    error => console.log('Error creating table LocationHistory:', error)
  );
}



function executeCreateVehicleTable(tx) {
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_name TEXT,
      plate_number_formatted TEXT,
      plate_number TEXT,
      category_id INTERGER,
      category_name TEXT,
      vehicle_load TEXT,
      last_violation_update TEXT
    );`,
    [],
    () => console.log('Table created successfully'),
    error => console.log('Error creating table:', error)
  );
}

function executeCreateViolationTable(tx) {
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS violations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vehicle_id INTEGER
        color TEXT,
        vehicle_type INTEGER,
        time_of_violation TEXT,
        place_of_violation TEXT,
        violation_details TEXT,
        status INTEGER,
        unit_name TEXT,
        contact_number TEXT,
        FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
      );`,
    [],
    () => console.log('Table violations created successfully'),
    error => console.log('Error creating table violations:', error)
  );
};

function executeCreateSettlementTable(tx) {
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS settlements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        violation_id INTEGER,
        place_of_settlement TEXT,
        address_of_settlement TEXT,
        contact_number TEXT,
        FOREIGN KEY (violation_id) REFERENCES violations(id) ON DELETE CASCADE
      );`,
    [],
    () => console.log('Table settlements created successfully'),
    error => console.log('Error creating table settlements:', error)
  );
};

function executeUpdateVehicle(vehicle) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      try {
        tx.executeSql(
          `UPDATE vehicles 
          SET 
            vehicle_name = ?,
            plate_number = ?,
            plate_number_formatted = ?,
            category_id = ?, 
            category_name = ?, 
            vehicle_load = ?
          WHERE id = ?;`,
          [
            vehicle.vehicleName, vehicle.plateNumber, vehicle.plateNumberFormatted,
            vehicle.categoryId, vehicle.categoryName, vehicle.vehicleLoad, vehicle.id
          ],
          (tx, results) => {
            console.log('Vehicle updated successfully');
            resolve(true);
          },
          (_, error) => {
            console.log('Error updating vehicle:', error);
            reject(error);
          }
        );
      } catch (err) {
        console.log('Unexpected error: ', err);
        reject(err);  // Promise rejected in case of unexpected errors
      }
    });
  });
}


function executeGetVehicleByid(vehicleId) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM vehicles WHERE id = ?;`,
        [vehicleId],
        (tx, results) => {
          resolve(results.rows.item(0)); // trả về kết quả thành công
        },
        (tx, error) => {
          console.log('error executeGetVehicleByid: ', error);
          reject(error); // trả về lỗi
        }
      );
    });
  });
}


function executeDeleteViolationByVehicleid(vehicleId) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM violations WHERE vehicle_id = ?;`,
        [vehicleId],
        (_, result) => {
          resolve(vehicleId); // thành công
        },
        (_, error) => {
          reject(error); // lỗi
        }
      );
    });
  });
}
function isVehicleExists(plateNumberFormatted, categoryId) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql( // kiểm tra biển số tồn tại
        `SELECT id FROM vehicles WHERE 
                  category_id = ? AND
                  plate_number_formatted = ?;`,
        [categoryId, plateNumberFormatted],
        (_, result) => {
          resolve(result.rows.length > 0);
        },
        (_, error) => {
          reject(error); // lỗi
        }
      );
    });
  });
}

function updateVehicle(vehicle, callback) {
  db.transaction(async (tx) => {
    try {
      //kiểm tra tồn tại xe update
      const vehicleOld = await executeGetVehicleByid(vehicle.id);
      if (vehicleOld) {
        if (vehicleOld.plate_number_formatted !== vehicle.plateNumberFormatted) {
          //kiểm tra biển số trùng
          const vehicleExists = await isVehicleExists(vehicle.plateNumberFormatted, vehicle.categoryId);
          if (!vehicleExists) {
            const deleteId = await executeDeleteViolationByVehicleid(vehicle.id);
            const res = await executeUpdateVehicle(vehicle)
            callback(res, 'success')
          } else {
            callback(false, "numberPlatesAlreadyExist");
          }
        } else {
          const res = await executeUpdateVehicle(vehicle)
          callback(res, 'success')
        }
      } else {
        callback(false, 'failed')
      }
    } catch (error) {
      console.log('error update === ', error);
      callback(false, 'failed')
    }
  })
}

function insertVehicle(vehicle, callback) {
  console.log('vehicle insertt ==== ', JSON.stringify(vehicle));
  const now = getCurrentDateTime();
  db.transaction(tx => {
    tx.executeSql( // kiểm tra tồn tại
      `SELECT id FROM vehicles WHERE 
              category_id = ? AND
              plate_number_formatted = ?;`,
      [vehicle.categoryId, vehicle.plateNumberFormatted],
      (tx, results) => {
        if (results.rows.length > 0) {
          console.log('result exitss ==== ', results.rows.item(0))
          callback(false, "numberPlatesAlreadyExist");
        } else {

          tx.executeSql(
            `INSERT INTO vehicles (vehicle_name, plate_number, plate_number_formatted,
              category_id, category_name, vehicle_load, last_violation_update) 
            VALUES(?, ?, ?, ?, ?, ?, ?);`,
            [vehicle.vehicleName, vehicle.plateNumber, vehicle.plateNumberFormatted.toUpperCase(),
            vehicle.categoryId, vehicle.categoryName, vehicle.vehicleLoad, now],
            () => {
              console.log('added successfully')
              callback(true, "Successfully");
            },
            error => console.log('Error inserting:', error)
          );

        }
      }
    )

  })
}


function setLastUpdate(vehicle_id) {
  db.transaction(tx => {
    const now = getCurrentDateTime();
    tx.executeSql( // update lần cập nhật gần nhất
      `UPDATE vehicles
       SET last_violation_update = ?
       WHERE id = ?`,
      [now, vehicle_id],
      () => console.log('last update : ', now),
      (tx, error) => console.log('error last update: ', error),
    );
  });
}

function deleteVehicle(vehicle) {
  db.transaction(tx => {
    tx.executeSql(
      `DELETE FROM violations WHERE vehicle_id = ?;`,
      [vehicle.id],
      (_, result) => {
        console.log(`violation with id ${vehicle.id} deleted successfully`);
      },
      (_, error) => {
        console.log('Error deleting violation:', error);
      }
    );

    tx.executeSql(
      `DELETE FROM vehicles WHERE id = ?;`,
      [vehicle.id],
      (_, result) => {
        console.log(`Vehicle with id ${vehicle.id} deleted successfully`);
        // return result
      },
      (_, error) => {
        console.log('Error deleting vehicle:', error);
      }
    );
  });
};

function getAllVehicle(callback) {
  db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM vehicles;`,
      [],
      (tx, results) => {
        const vehicles = [];
        for (let i = 0; i < results.rows.length; i++) {
          vehicles.push(results.rows.item(i));
        }
        callback(true, vehicles);
      },
      error => {
        console.log('Error fetching vehicles:', error)
        callback(false, error);
      }
    );
  });
};

function getVehicleByPlateNumber(plateNumberFormatted, categoryId, callback) {
  db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM vehicles WHERE plate_number_formatted = ?
                                    AND category_id = ?;`,
      [plateNumberFormatted, categoryId],
      (tx, results) => {
        const vehicles = [];
        for (let i = 0; i < results.rows.length; i++) {
          vehicles.push(results.rows.item(i));
        }
        callback(true, vehicles[0]);
      },
      error => {
        console.log('Error fetching vehicles:', error)
        callback(false, error);
      }
    );
  });
};

function getVehicleById(vehicleId) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM vehicles WHERE id = ?;`,
        [vehicleId],
        (tx, results) => {
          if (results.rows.length > 0) {
            const vehicle = results.rows.item(0);
            resolve(vehicle);
          } else {
            resolve(undefined);
          }
        },
        error => {
          console.log(`Error get vehicle by id:`, error);
          reject(new Error(`Error getting vehicle: ${error.message}`)); // Reject với thông điệp lỗi
        }
      );
    });
  });
}

function getFirstVehicle(callback) {
  db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM vehicles;`,
      [],
      (tx, results) => {
        // if (results) {
        const vehicle = results.rows.item(0);
        //   callback(true, vehicle);
        // } else {
        //   callback(false, undefined);
        // }
        callback(true, vehicle);
      },
      error => {
        console.log(`Error get first vehicle:`, error)
        callback(false, error);
      }
    );
  });
};

//violation

function getViolationCountByStatusAndVehicleId(vehicle_id, status) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT COUNT(id) as count FROM violations WHERE vehicle_id = ? AND status = ?;`,
        [vehicle_id, status],
        (tx, results) => {
          const count = results.rows.item(0).count;
          resolve(count); // Trả về count nếu thành công
        },
        (tx, error) => {
          console.log('Error select count violation:', error);
          reject(error); // Trả về lỗi nếu thất bại
        }
      );
    });
  });
}

function getViolationCountByStatus(status, callback) {
  db.transaction(tx => {
    tx.executeSql(
      `SELECT COUNT(id) as count FROM violations WHERE status = ?;`,
      [status],
      (tx, results) => {
        const count = results.rows.item(0).count;
        callback(count);
      },
      (tx, error) => {
        console.log('Error fetching violation:', error)
        callback(error);
      }
    );
  });
}

function getViolationByVehicleId(vehicleId, callback) {
  db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM violations WHERE vehicle_id = ?;`,
      [vehicleId],
      (tx, results) => {
        const violations = [];
        for (let i = 0; i < results.rows.length; i++) {

          violations.push(results.rows.item(i));
        }
        callback(true, violations);
      },
      (tx, error) => {
        console.log('Error fetching violation:', error)
        callback(false, error);
      }
    );
  });
}

function getAllViolationByVehicleId(vehicleId) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM violations WHERE vehicle_id = ?;`,
        [vehicleId],
        async (tx, results) => {
          try {
            const violations = [];
            for (let i = 0; i < results.rows.length; i++) {
              const violation = results.rows.item(i);
              const settlementDetails = await getSettlementByViolationId(violation.id);
              violations.push({ ...violation, settlement_details: settlementDetails });
            }
            resolve(violations);
          } catch (error) {
            console.log('Error fetching settlements for violations:', error);
            reject(error);
          }
        },
        (tx, error) => {
          console.log('Error fetching violations:', error);
          reject(error);
        }
      );
    });
  });
}

function executeSqlInsertViolation(tx, violation, vehicle_id, callback) {
  console.log('inserttt: ' + vehicle_id + " " + JSON.stringify(violation));
  tx.executeSql(
    `INSERT INTO violations 
        (vehicle_id, vehicle_type, time_of_violation,
        place_of_violation, status, unit_name, contact_number, violation_details) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,

    [vehicle_id, violation.vehicle_type, violation.time_of_violation,
      violation.place_of_violation, violation.status, violation.unit_name, violation.contact_number, violation.violation_details],
    (tx, result) => {
      console.log('violations added successfully');
      callback(result.insertId);
    },
    (error) => console.log('Error inserting:', error)
  );
}

function executeSqlDeleteViolation(tx, vehicle_id) {
  tx.executeSql(
    `DELETE FROM violations WHERE vehicle_id = ?;`,
    [vehicle_id],
    (_, result) => {
      console.log(`violation with id ${vehicle_id} deleted successfully`);
    },
    (_, error) => {
      console.log('Error deleting violation:', error);
    }
  );
}

function executeSqlDeleteSettlement(tx, violation_id) {
  tx.executeSql(
    `DELETE FROM settlements WHERE violation_id = ?;`,
    [violation_id],
    (_, result) => {
      console.log(`settlement with id ${violation_id} deleted successfully`);
    },
    (_, error) => {
      console.log('Error deleting settlement:', error);
    }
  );
}

function executeSqlInsertSettlement(tx, violation_id, settlement) {
  console.log('insert settlement ---- ' + violation_id + ' --- ', JSON.stringify(settlement.address_of_settlement));
  tx.executeSql(
    `INSERT INTO settlements 
        (violation_id, place_of_settlement, contact_number, address_of_settlement) 
        VALUES (?, ?, ?, ?);`,
    [violation_id, settlement.place_of_settlement, settlement.contact_number, settlement.address_of_settlement],
    () => console.log('settlements added successfully'),
    (error) => console.log('Error inserting:', error)
  );
}

function saveViolationRange(violations, vehicle_id) {
  // console.log('violation_details: ===== ', violations[0].violation_details);
  db.transaction(tx => {
    const now = getCurrentDateTime();
    tx.executeSql( // update lần cập nhật gần nhất
      `UPDATE vehicles
       SET last_violation_update = ?
       WHERE id = ?`,
      [now, vehicle_id],
      () => console.log('last update : ', now),
      (tx, error) => console.log('error last update: ', error),
    );

    tx.executeSql( // kiểm tra tồn tại
      `SELECT id FROM violations
      WHERE vehicle_id = ?;`,
      [vehicle_id],
      (tx, results) => {
        if (results.rows.length > 0) {
          const violation_id = results.rows.item(0).id;
          executeSqlDeleteSettlement(tx, violation_id);
          executeSqlDeleteViolation(tx, vehicle_id);
        }
        violations.forEach(item => {
          // console.log('insertttttt ----------')
          const contactNumber = item.settlement_details[0].contact_number;
          executeSqlInsertViolation(tx, { ...item, contact_number: contactNumber }, vehicle_id, (violation_id) => {
            item.settlement_details.forEach(settlement => {
              executeSqlInsertSettlement(tx, violation_id, settlement);
            })
          });
        });
      },
      (error) => console.log('error check isExists: ', error),
    );

  })

}

function getSettlementByViolationId(violationId) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM settlements WHERE violation_id = ?;`,
        [violationId],
        (tx, results) => {
          const settlements = [];
          for (let i = 0; i < results.rows.length; i++) {
            settlements.push(results.rows.item(i));
          }
          resolve(settlements);
        },
        (error) => {
          console.log('Error fetching settlements:', error);
          reject(error);
        }
      );
    });
  });
}


function getLocationHistory(date, callback) {
  // console.log("_________TEST_______________", callback)
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .split('T')[0];

  console.log('Fetching location history for date:', localDate);

  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM LocationHistory WHERE date = ?',
      [localDate],
      (_, result) => {
        const locationHistory = [];
        for (let i = 0; i < result.rows.length; i++) {
          locationHistory.push(result.rows.item(i));
        }
        console.log('Fetched location history:', locationHistory);
        // callback(locationHistory);
        callback(true, locationHistory);
      },
      error => {
        console.log('Error fetching location history:', error)
        callback(false, error);
      }
    );
  });
}


function insertLocationHistory(locationLat, locationLong, totalDistance, totalTime, time) {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000) // Chuyển đổi UTC sang Local Time
    .toISOString()
    .split('T')[0];

  // console.log('Saving location history:');
  // console.log('Local Date:', localDate);
  // console.log('Location Latitude:', locationLat);
  // console.log('Location Longitude:', locationLong);
  // console.log('Total Distance:', totalDistance);
  // console.log('Total Time:', totalTime);

  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO LocationHistory (date, locationLat, locationLong, totalDistance, totalTime,time) VALUES (?, ?, ?, ?, ?, ?)',
      [localDate, String(locationLat), String(locationLong), String(totalDistance), String(totalTime), String(time)],
      // () => console.log('Location history added successfully'),
      null,
      error => console.log('Error adding location history:', error)
    );
  });
}



module.exports = {
  insertVehicle,
  updateVehicle,
  getAllVehicle,
  getVehicleByPlateNumber,
  deleteVehicle,
  getViolationCountByStatusAndVehicleId,
  getViolationCountByStatus,
  getViolationByVehicleId,
  getAllViolationByVehicleId,
  saveViolationRange,
  getVehicleById,
  getFirstVehicle,
  setLastUpdate,
  insertLocationHistory,
  getLocationHistory,
}
