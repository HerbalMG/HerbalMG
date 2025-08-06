const sql = require('../config/supabase');
const imagekit = require('../config/imagekit');
const extractImageKitFileId = require('../utils/extractImageKitFileId');

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await sql`
      SELECT d.*, COALESCE(json_agg(json_build_object(
        'day_of_week', s.day_of_week,
        'morning_start_time', s.morning_start_time,
        'morning_end_time', s.morning_end_time,
        'evening_start_time', s.evening_start_time,
        'evening_end_time', s.evening_end_time
      )) FILTER (WHERE s.id IS NOT NULL), '[]')::json AS schedules
      FROM doctor d
      LEFT JOIN doctor_schedule s ON s.doctor_id = d.id
      GROUP BY d.id
      ORDER BY d.id DESC;
    `;
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const [doctor] = await sql`SELECT * FROM doctor WHERE id = ${req.params.id}`;
    if (!doctor) return res.status(404).json({ error: 'Not found' });

    const schedules = await sql`
      SELECT day_of_week, morning_start_time, morning_end_time,
             evening_start_time, evening_end_time, is_available
      FROM doctor_schedule
      WHERE doctor_id = ${req.params.id}
    `;
    doctor.schedules = schedules;
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createDoctor = async (req, res) => {
  const {
    image_url, name, phone_number, degree, address, city, state, pincode,
    specialization, rating, schedules = []
  } = req.body;

  try {
    const [doctor] = await sql`
      INSERT INTO doctor (
        image_url, name, phone_number, degree, address, city, state, pincode,
        specialization, rating
      )
      VALUES (
        ${image_url}, ${name}, ${phone_number}, ${degree}, ${address}, ${city}, ${state}, ${pincode},
        ${specialization}, ${rating}
      )
      RETURNING *;
    `;

    for (const s of schedules) {
      try {
        await sql`
          INSERT INTO doctor_schedule (
            doctor_id, day_of_week,
            morning_start_time, morning_end_time,
            evening_start_time, evening_end_time
          )
          VALUES (
            ${doctor.id}, ${s.day_of_week},
            ${s.morning_start_time}, ${s.morning_end_time},
            ${s.evening_start_time}, ${s.evening_end_time}
          );
        `;
      } catch (err) {
        console.error('Error inserting schedule:', s, err);
      }
    }

    const [doctorWithSchedules] = await sql`SELECT * FROM doctor WHERE id = ${doctor.id}`;
    const doctorSchedules = await sql`
      SELECT day_of_week, morning_start_time, morning_end_time,
             evening_start_time, evening_end_time
      FROM doctor_schedule
      WHERE doctor_id = ${doctor.id}
    `;
    doctorWithSchedules.schedules = doctorSchedules;

    res.status(201).json(doctorWithSchedules);
  } catch (err) {
    console.error('Error in createDoctor:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateDoctor = async (req, res) => {
  const {
    image_url, name, phone_number, degree, address, city, state, pincode,
    specialization, rating, schedules = []
  } = req.body;

  try {
    const [doctor] = await sql`
      UPDATE doctor SET
        image_url = ${image_url},
        name = ${name},
        phone_number = ${phone_number},
        degree = ${degree},
        address = ${address},
        city = ${city},
        state = ${state},
        pincode = ${pincode},
        specialization = ${specialization},
        rating = ${rating},
        updated_at = NOW()
      WHERE id = ${req.params.id}
      RETURNING *;
    `;

    await sql`DELETE FROM doctor_schedule WHERE doctor_id = ${req.params.id};`;

    for (const s of schedules) {
      try {
        await sql`
          INSERT INTO doctor_schedule (
            doctor_id, day_of_week,
            morning_start_time, morning_end_time,
            evening_start_time, evening_end_time
          )
          VALUES (
            ${req.params.id}, ${s.day_of_week},
            ${s.morning_start_time}, ${s.morning_end_time},
            ${s.evening_start_time}, ${s.evening_end_time}
          );
        `;
      } catch (err) {
        console.error('Error inserting schedule:', s, err);
      }
    }

    const [doctorWithSchedules] = await sql`SELECT * FROM doctor WHERE id = ${req.params.id}`;
    const doctorSchedules = await sql`
      SELECT day_of_week, morning_start_time, morning_end_time,
             evening_start_time, evening_end_time
      FROM doctor_schedule
      WHERE doctor_id = ${req.params.id}
    `;
    doctorWithSchedules.schedules = doctorSchedules;

    res.json(doctorWithSchedules);
  } catch (err) {
    console.error('Error in updateDoctor:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    const [doctor] = await sql`SELECT * FROM doctor WHERE id=${req.params.id}`;
    if (!doctor) return res.status(404).json({ error: 'Not found' });

    if (doctor.image_url) {
      const filePath = extractImageKitFileId(doctor.image_url);
      if (filePath) {
        try {
          // List files to find the file by path
          const files = await imagekit.listFiles({
            path: '/' + filePath.split('/').slice(0, -1).join('/'),
            searchQuery: `name="${filePath.split('/').pop().split('.')[0]}"`,
          });

          if (files.length > 0) {
            await imagekit.deleteFile(files[0].fileId);
          }
        } catch (imagekitErr) {
          console.error('ImageKit delete error:', imagekitErr);
        }
      }
    }

    await sql`DELETE FROM doctor WHERE id=${req.params.id};`;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
