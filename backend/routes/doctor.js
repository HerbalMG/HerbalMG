// const express = require('express');
// const router = express.Router();
// const sql = require('../config/supabase');
// const imagekit = require('../config/imagekit');
// const auth = require('./auth');

// const extractImageKitFileId = require('../utils/extractImageKitFileId');

// function requireAdminOrLimitedAdmin(req, res, next) {
//   if (!req.user || !['admin', 'limited_admin'].includes(req.user.role)) {
//     return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
//   }
//   next();
// }

// // // Get all doctors
// // router.get('/', async (req, res) => {
// //   try {
// //     const doctors = await sql`SELECT * FROM doctor ORDER BY id DESC`;
// //     res.json(doctors);
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // Get doctor by ID
// // router.get('/:id', async (req, res) => {
// //   try {
// //     const [doctor] = await sql`SELECT * FROM doctor WHERE id = ${req.params.id}`;
// //     if (!doctor) return res.status(404).json({ error: 'Not found' });
// //     res.json(doctor);
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // Create doctor
// // router.post('/', auth, requireAdminOrLimitedAdmin, async (req, res) => {
// //   const {
// //     image_url,
// //     name,
// //     phone_number,
// //     degree,
// //     address,
// //     city,
// //     state,
// //     pincode,
// //     morning_start_time,
// //     morning_end_time,
// //     evening_start_time,
// //     evening_end_time,
// //     specialization,
// //     rating,
// //     is_available
// //   } = req.body;

// //   try {
// //     const [doctor] = await sql`
// //       INSERT INTO doctor (
// //         image_url, name, phone_number, degree, address, city, state, pincode,
// //         morning_start_time, morning_end_time, evening_start_time, evening_end_time,
// //         specialization, rating, is_available
// //       )
// //       VALUES (
// //         ${image_url}, ${name}, ${phone_number}, ${degree}, ${address}, ${city}, ${state}, ${pincode},
// //         ${morning_start_time}, ${morning_end_time}, ${evening_start_time}, ${evening_end_time},
// //         ${specialization}, ${rating}, ${is_available}
// //       )
// //       RETURNING *`;

// //     res.status(201).json(doctor);
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // Update doctor
// // router.put('/:id', auth, requireAdminOrLimitedAdmin, async (req, res) => {
// //   const {
// //     image_url,
// //     name,
// //     phone_number,
// //     degree,
// //     address,
// //     city,
// //     state,
// //     pincode,
// //     morning_start_time,
// //     morning_end_time,
// //     evening_start_time,
// //     evening_end_time,
// //     specialization,
// //     rating,
// //     is_available
// //   } = req.body;

// //   try {
// //     const [doctor] = await sql`
// //       UPDATE doctor SET
// //         image_url = ${image_url},
// //         name = ${name},
// //         phone_number = ${phone_number},
// //         degree = ${degree},
// //         address = ${address},
// //         city = ${city},
// //         state = ${state},
// //         pincode = ${pincode},
// //         morning_start_time = ${morning_start_time},
// //         morning_end_time = ${morning_end_time},
// //         evening_start_time = ${evening_start_time},
// //         evening_end_time = ${evening_end_time},
// //         specialization = ${specialization},
// //         rating = ${rating},
// //         is_available = ${is_available},
// //         updated_at = NOW()
// //       WHERE id = ${req.params.id}
// //       RETURNING *`;

// //     if (!doctor) return res.status(404).json({ error: 'Not found' });
// //     res.json(doctor);
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // Delete doctor
// // router.delete('/:id', auth, requireAdminOrLimitedAdmin, async (req, res) => {
// //   try {
// //     const [doctor] = await sql`SELECT * FROM doctor WHERE id=${req.params.id}`;
// //     if (!doctor) return res.status(404).json({ error: 'Not found' });

// //     if (doctor.image_url) {
// //       const filePath = extractImageKitFileId(doctor.image_url);
// //       if (filePath) {
// //         try {
// //           const files = await imagekit.listFiles({
// //             path: '/' + filePath.split('/').slice(0, -1).join('/'),
// //             searchQuery: `name="${filePath.split('/').pop().split('.')[0]}"`,
// //           });
// //           if (files.length > 0) {
// //             await imagekit.deleteFile(files[0].fileId);
// //           }
// //         } catch (imagekitErr) {
// //           console.error('ImageKit delete error:', imagekitErr);
// //         }
// //       }
// //     }

// //     const [deleted] = await sql`DELETE FROM doctor WHERE id=${req.params.id} RETURNING *`;
// //     res.json({ success: true });
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // ... existing imports ...
// // GET all doctors with schedules
// router.get('/', async (req, res) => {
//   try {
//     const doctors = await sql`
//       SELECT d.*, COALESCE(json_agg(json_build_object(
//         'day_of_week', s.day_of_week,
//         'morning_start_time', s.morning_start_time,
//         'morning_end_time', s.morning_end_time,
//         'evening_start_time', s.evening_start_time,
//         'evening_end_time', s.evening_end_time
//       )) FILTER (WHERE s.id IS NOT NULL), '[]')::json AS schedules
//       FROM doctor d
//       LEFT JOIN doctor_schedule s ON s.doctor_id = d.id
//       GROUP BY d.id
//       ORDER BY d.id DESC;
//     `;
//     res.json(doctors);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET doctor by ID with schedule
// router.get('/:id', async (req, res) => {
//   try {
//     const [doctor] = await sql`SELECT * FROM doctor WHERE id = ${req.params.id}`;
//     if (!doctor) return res.status(404).json({ error: 'Not found' });

//     const schedules = await sql`
//       SELECT day_of_week, morning_start_time, morning_end_time,
//              evening_start_time, evening_end_time, is_available
//       FROM doctor_schedule
//       WHERE doctor_id = ${req.params.id}
//     `;
//     doctor.schedules = schedules;
//     res.json(doctor);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // POST create doctor with schedule
// router.post('/', auth, requireAdminOrLimitedAdmin, async (req, res) => {
//   const {
//     image_url, name, phone_number, degree, address, city, state, pincode,
//     specialization, rating, schedules = []
//   } = req.body;

//   console.log('POST /api/doctor received schedules:', schedules);

//   try {
//     const [doctor] = await sql`
//       INSERT INTO doctor (
//         image_url, name, phone_number, degree, address, city, state, pincode,
//         specialization, rating
//       )
//       VALUES (
//         ${image_url}, ${name}, ${phone_number}, ${degree}, ${address}, ${city}, ${state}, ${pincode},
//         ${specialization}, ${rating}
//       )
//       RETURNING *;
//     `;

//     for (const s of schedules) {
//       try {
//         await sql`
//           INSERT INTO doctor_schedule (
//             doctor_id, day_of_week,
//             morning_start_time, morning_end_time,
//             evening_start_time, evening_end_time
//           )
//           VALUES (
//             ${doctor.id}, ${s.day_of_week},
//             ${s.morning_start_time}, ${s.morning_end_time},
//             ${s.evening_start_time}, ${s.evening_end_time}
//           );
//         `;
//       } catch (err) {
//         console.error('Error inserting schedule:', s, err);
//       }
//     }

//     // Fetch doctor with schedules to return
//     const [doctorWithSchedules] = await sql`SELECT * FROM doctor WHERE id = ${doctor.id}`;
//     const doctorSchedules = await sql`
//       SELECT day_of_week, morning_start_time, morning_end_time,
//              evening_start_time, evening_end_time
//       FROM doctor_schedule
//       WHERE doctor_id = ${doctor.id}
//     `;
//     doctorWithSchedules.schedules = doctorSchedules;

//     res.status(201).json(doctorWithSchedules);
//   } catch (err) {
//     console.error('Error in POST /api/doctor:', err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // PUT update doctor and schedules
// router.put('/:id', auth, requireAdminOrLimitedAdmin, async (req, res) => {
//   const {
//     image_url, name, phone_number, degree, address, city, state, pincode,
//     specialization, rating, schedules = []
//   } = req.body;

//   console.log('PUT /api/doctor received schedules:', schedules);

//   try {
//     const [doctor] = await sql`
//       UPDATE doctor SET
//         image_url = ${image_url},
//         name = ${name},
//         phone_number = ${phone_number},
//         degree = ${degree},
//         address = ${address},
//         city = ${city},
//         state = ${state},
//         pincode = ${pincode},
//         specialization = ${specialization},
//         rating = ${rating},
//         updated_at = NOW()
//       WHERE id = ${req.params.id}
//       RETURNING *;
//     `;

//     await sql`DELETE FROM doctor_schedule WHERE doctor_id = ${req.params.id};`;

//     for (const s of schedules) {
//       try {
//         await sql`
//           INSERT INTO doctor_schedule (
//             doctor_id, day_of_week,
//             morning_start_time, morning_end_time,
//             evening_start_time, evening_end_time
//           )
//           VALUES (
//             ${req.params.id}, ${s.day_of_week},
//             ${s.morning_start_time}, ${s.morning_end_time},
//             ${s.evening_start_time}, ${s.evening_end_time}
//           );
//         `;
//       } catch (err) {
//         console.error('Error inserting schedule:', s, err);
//       }
//     }

//     // Fetch doctor with schedules to return
//     const [doctorWithSchedules] = await sql`SELECT * FROM doctor WHERE id = ${req.params.id}`;
//     const doctorSchedules = await sql`
//       SELECT day_of_week, morning_start_time, morning_end_time,
//              evening_start_time, evening_end_time
//       FROM doctor_schedule
//       WHERE doctor_id = ${req.params.id}
//     `;
//     doctorWithSchedules.schedules = doctorSchedules;

//     res.json(doctorWithSchedules);
//   } catch (err) {
//     console.error('Error in PUT /api/doctor:', err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // DELETE doctor
// router.delete('/:id', auth, requireAdminOrLimitedAdmin, async (req, res) => {
//   try {
//     const [doctor] = await sql`SELECT * FROM doctor WHERE id=${req.params.id}`;
//     if (!doctor) return res.status(404).json({ error: 'Not found' });

//     if (doctor.image_url) {
//       const filePath = extractImageKitFileId(doctor.image_url);
//       if (filePath) {
//         try {
//           const files = await imagekit.listFiles({
//             path: '/' + filePath.split('/').slice(0, -1).join('/'),
//             searchQuery: `name="${filePath.split('/').pop().split('.')[0]}"`,
//           });
//           if (files.length > 0) {
//             await imagekit.deleteFile(files[0].fileId);
//           }
//         } catch (imagekitErr) {
//           console.error('ImageKit delete error:', imagekitErr);
//         }
//       }
//     }

//     await sql`DELETE FROM doctor WHERE id=${req.params.id};`;
//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;



const express = require('express');
const router = express.Router();
const controller = require('../controllers/doctorController');
const auth = require('../middleware/auth');
const requireAdminOrLimitedAdmin = require('../middleware/requireAdminOrLimitedAdmin');

router.get('/', controller.getAllDoctors);
router.get('/:id', controller.getDoctorById);

router.post('/', auth, requireAdminOrLimitedAdmin, controller.createDoctor);
router.put('/:id', auth, requireAdminOrLimitedAdmin, controller.updateDoctor);
router.delete('/:id', auth, requireAdminOrLimitedAdmin, controller.deleteDoctor);

module.exports = router;

