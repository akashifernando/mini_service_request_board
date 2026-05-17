const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const JobRequest = require('../src/models/JobRequest');

// Set test environment configuration
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27018/service-request-board-test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecretkeyforjest';

let token;
let seededJobId;

beforeAll(async () => {
  // Connect to DB
  await mongoose.connect(process.env.MONGODB_URI);

  // Clear database
  await User.deleteMany({});
  await JobRequest.deleteMany({});

  // Seed a test user
  const userResponse = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Test Tradesperson',
      email: 'test@example.com',
      password: 'password123',
    });

  token = userResponse.body.data.token;

  // Seed one job request
  const job = await JobRequest.create({
    title: 'Initial Test Job',
    description: 'Initial job description for testing',
    category: 'Plumbing',
    location: 'Glasgow',
    contactName: 'Jane Doe',
    contactEmail: 'jane@example.com',
    status: 'Open',
  });
  seededJobId = job._id.toString();
});

afterAll(async () => {
  // Clean up database and close connection
  await User.deleteMany({});
  await JobRequest.deleteMany({});
  await mongoose.connection.close();
});

describe('Jobs API Endpoints', () => {
  
  describe('GET /api/jobs', () => {
    it('should retrieve a list of all jobs', async () => {
      const res = await request(app)
        .get('/api/jobs')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should filter jobs by category', async () => {
      const res = await request(app)
        .get('/api/jobs?category=Plumbing')
        .expect(200);

      expect(res.body.success).toBe(true);
      res.body.data.forEach(job => {
        expect(job.category).toBe('Plumbing');
      });
    });

    it('should filter jobs by status', async () => {
      const res = await request(app)
        .get('/api/jobs?status=Open')
        .expect(200);

      expect(res.body.success).toBe(true);
      res.body.data.forEach(job => {
        expect(job.status).toBe('Open');
      });
    });

    it('should search jobs by keyword', async () => {
      const res = await request(app)
        .get('/api/jobs?search=Initial')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.some(job => job.title.includes('Initial'))).toBe(true);
    });
  });

  describe('GET /api/jobs/:id', () => {
    it('should fetch details of a single job request', async () => {
      const res = await request(app)
        .get(`/api/jobs/${seededJobId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(seededJobId);
      expect(res.body.data.title).toBe('Initial Test Job');
    });

    it('should return a 404 for non-existent ObjectID format', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const res = await request(app)
        .get(`/api/jobs/${fakeId}`)
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/jobs', () => {
    it('should return 401 when creating a job request without authorization', async () => {
      const res = await request(app)
        .post('/api/jobs')
        .send({
          title: 'Unauthorized job',
          description: 'This shouldn\'t work',
          category: 'Plumbing',
          location: 'Glasgow',
          contactName: 'No name',
          contactEmail: 'no@example.com',
        })
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    it('should successfully create a job request with a valid authorization token', async () => {
      const res = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Authorized plumbing job',
          description: 'A professional is needed to fit a new bathroom sink.',
          category: 'Plumbing',
          location: 'Edinburgh',
          contactName: 'Mark Jenkins',
          contactEmail: 'mark@example.com',
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Authorized plumbing job');
      expect(res.body.data.status).toBe('Open');
    });

    it('should return 400 validation error if email format is incorrect', async () => {
      const res = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Bad Email job',
          description: 'Validation testing',
          category: 'Plumbing',
          location: 'Glasgow',
          contactName: 'John',
          contactEmail: 'not_an_email',
        })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('valid contact email');
    });
  });

  describe('PATCH /api/jobs/:id', () => {
    it('should allow changing a job status when authenticated', async () => {
      const res = await request(app)
        .patch(`/api/jobs/${seededJobId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          status: 'In Progress',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('In Progress');
    });

    it('should block status change without token', async () => {
      const res = await request(app)
        .patch(`/api/jobs/${seededJobId}`)
        .send({ status: 'Closed' })
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    it('should validate status values and reject incorrect enums', async () => {
      const res = await request(app)
        .patch(`/api/jobs/${seededJobId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'InvalidStatus' })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Invalid status');
    });
  });

  describe('DELETE /api/jobs/:id', () => {
    it('should block deletion without authentication token', async () => {
      const res = await request(app)
        .delete(`/api/jobs/${seededJobId}`)
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    it('should delete a job request when authenticated', async () => {
      const res = await request(app)
        .delete(`/api/jobs/${seededJobId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.success).toBe(true);

      // Verify that the job is deleted
      const checkRes = await request(app)
        .get(`/api/jobs/${seededJobId}`)
        .expect(404);

      expect(checkRes.body.success).toBe(false);
    });
  });
});
