import pool from "../config/db.js";
export async function getAdminDashboardData() {
    try {
        // Get today's date in YYYY-MM-DD format (e.g., '2025-05-25')
        const currentDate = new Date().toISOString().split('T')[0];

        // Attendance data per employee
        const [attendanceData] = await pool.query(`
            WITH todays_logs AS (
                SELECT *
                FROM new_timelog
                WHERE mobile_date >= ? AND mobile_date < DATE_ADD(?, INTERVAL 1 DAY)
            ),
            latest_logs AS (
                SELECT tl.*
                FROM todays_logs tl
                INNER JOIN (
                    SELECT username, MAX(mobile_time) AS max_time
                    FROM todays_logs
                    GROUP BY username
                ) latest ON tl.username = latest.username AND tl.mobile_time = latest.max_time
            )

            SELECT 
                u.id AS user_id,
                u.username,
                u.department_code,
                u.designation,

                MAX(CASE WHEN tl.activity_type = 'IN' THEN tl.mobile_time END) AS check_in_time,
                MAX(CASE WHEN tl.activity_type = 'OUT' THEN tl.mobile_time END) AS check_out_time,

                l.employee_img AS attendance_image,

                CASE 
                    WHEN l.username IS NOT NULL THEN 'Present'
                    ELSE 'Absent'
                END AS attendance_status

            FROM users u
            LEFT JOIN todays_logs tl ON u.username = tl.username
            LEFT JOIN latest_logs l ON u.username = l.username

            WHERE u.usertype = 'E'
              AND u.status = 'A'
              AND u.is_delete = 0

            GROUP BY 
                u.id, u.username, u.department_code, u.designation,
                l.employee_img, l.username

            ORDER BY u.department_code, u.username;
        `, [currentDate, currentDate]);

        // Department-wise summary
        const [departmentSummary] = await pool.query(`
            WITH todays_logs AS (
                SELECT *
                FROM new_timelog
                WHERE mobile_date >= ? AND mobile_date < DATE_ADD(?, INTERVAL 1 DAY)
            )

            SELECT 
                u.department_code,
                COUNT(DISTINCT u.id) AS total_employees,
                COUNT(DISTINCT CASE WHEN tl.activity_type = 'IN' THEN u.id END) AS total_in,
                COUNT(DISTINCT CASE WHEN tl.activity_type = 'OUT' THEN u.id END) AS total_out,
                COUNT(DISTINCT CASE WHEN tl.username IS NOT NULL THEN u.id END) AS total_present,
                COUNT(DISTINCT CASE 
                    WHEN tl.activity_type = 'IN' AND TIME(tl.mobile_time) > '10:00:00' THEN u.id
                END) AS late_reporting

            FROM users u
            LEFT JOIN todays_logs tl ON u.username = tl.username

            WHERE u.usertype = 'E'
              AND u.status = 'A'
              AND u.is_delete = 0

            GROUP BY u.department_code
            ORDER BY u.department_code;
        `, [currentDate, currentDate]);

        return {
            employeeAttendance: attendanceData,
            departmentSummary: departmentSummary
        };
    } catch (error) {
        console.error("Error fetching attendance data:", error);
        throw error;
    }
}


export async function getEmployeesByDepartment(departmentCode) {
  try {
    const [employees] = await pool.query(
      `
      SELECT 
        u.id AS user_id,
        u.username,
        u.name,
        u.designation,
        u.profile_img,

        -- Today's IN record (first IN)
        (
          SELECT nt.employee_img 
          FROM new_timelog nt 
          WHERE nt.userid = u.id 
            AND nt.activity_type = 'IN'
            AND DATE(nt.mobile_date) = CURDATE()
          ORDER BY nt.mobile_time ASC
          LIMIT 1
        ) AS checkin_image,

        -- Today's OUT record (latest OUT)
        (
          SELECT nt.employee_img 
          FROM new_timelog nt 
          WHERE nt.userid = u.id 
            AND nt.activity_type = 'OUT'
            AND DATE(nt.mobile_date) = CURDATE()
          ORDER BY nt.mobile_time DESC
          LIMIT 1
        ) AS checkout_image

      FROM users u
      WHERE u.department_code = ?
        AND u.status = 'A'
        AND u.is_delete = 0;
      `,
      [departmentCode] // ✅ only one param
    );
console.log("Querying for department:",departmentCode);
    return employees;
  } catch (error) {
    console.error('Error in getEmployeesByDepartment:', error);
    throw error;
  }
}


export async function getEmployeeDetails(username) {
    try {
        // Step 1: Get full employee profile
        const [employeeDetails] = await pool.query(
            `
            SELECT 
                id AS user_id,
                username,
                title,
                name,
                designation,
                department_code,
                profile_img,
                mobile_no,
                location
            FROM users 
            WHERE username = ?
            `,
            [username]
        );

        // If user not found
        if (!employeeDetails || employeeDetails.length === 0) {
            return null;
        }

        // Step 2: Get current month range
        const currentDate = new Date();
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        // Step 3: Get all attendance records for current month
        const [attendanceRecords] = await pool.query(
            `
            SELECT 
                username,
                mobile_date,
                mobile_time,
                activity_type,
                address AS location,
                employee_img AS attendance_image,
                distance
            FROM new_timelog
            WHERE username = ?
              AND mobile_date BETWEEN ? AND ?
            ORDER BY mobile_date, activity_type
            `,
            [username, firstDay, lastDay]
        );

        // Step 4: Combine profile + attendance in one object
        return {
            ...employeeDetails[0],
            attendance: attendanceRecords
        };

    } catch (error) {
        console.error('Error in getEmployeeDetails:', error);
        throw error;
    }
}

// model.js
// export async function getEmployeeAttendance(username) {
//     try {
//         const [attendanceRecords] = await pool.query(
//             `
//             SELECT 
//                 username,
//                 mobile_date,
//                 activity_type,
//                 address AS location,
//                 employee_img AS attendance_image,
//                 mobile_details
//             FROM new_timelog
//             WHERE username = ?
//             ORDER BY mobile_date, activity_type
//             `,
//             [username] // ✅ Only 1 parameter now
//         );

//         return attendanceRecords;
//     } catch (error) {
//         console.error('Error in getEmployeeAttendance:', error);
//         throw error;
//     }
// }



export async function getEmployeeAttendance(username) {
    try {
        const [attendanceRecords] = await pool.query(
            `
            SELECT 
                u.username,
                CONCAT(u.title, ' ', u.name) AS full_name,
                nt.mobile_date,
                nt.mobile_time,
                nt.activity_type,
                nt.address AS location,
                nt.employee_img AS attendance_image,
                nt.mobile_details
            FROM new_timelog nt
            JOIN users u ON u.username = nt.username
            WHERE nt.username = ?
            ORDER BY nt.mobile_date, nt.activity_type
            `,
            [username]
        );

        return attendanceRecords;
    } catch (error) {
        console.error('Error in getEmployeeAttendance:', error);
        throw error;
    }
}
export async function getSearch(searchQuery) {
  try {
    // Search query - searches in both name and username
    const queryPattern = `%${searchQuery}%`;
    const startPattern = `${searchQuery}%`;
    
    const [rows] = await pool.query(`
      SELECT 
        id AS emp_id,
        name,
        username,
        profile_img,
        mobile_no,
        department_code,
        designation
      FROM users
      WHERE 
        (name LIKE ? OR username LIKE ?)
      ORDER BY 
        CASE 
          WHEN name LIKE ? THEN 1
          WHEN username LIKE ? THEN 2
          ELSE 3
        END,
        name ASC
      LIMIT 10
    `, [queryPattern, queryPattern, startPattern, startPattern]);
    
    return rows;
  } catch (error) {
    console.error('Error searching employees:', error);
    throw error;
  }
}