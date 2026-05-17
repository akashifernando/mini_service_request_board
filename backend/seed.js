require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const JobRequest = require('./src/models/JobRequest');

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await User.deleteMany();
    await JobRequest.deleteMany();
    console.log('Cleared existing data.');

    // Create a seed user
    const user = await User.create({
      name: 'John Tradesperson',
      email: 'john@example.com',
      password: 'password123', // Will be hashed automatically by user pre-save hook
    });
    console.log('Created test user:', user.email);

    // Sample Job Requests
    const jobs = [
      {
        title: 'Need a plumber for a leaking kitchen tap',
        description: 'The hot water tap in our kitchen is constantly dripping and won\'t shut off completely. Needs a new washer or full tap replacement.',
        category: 'Plumbing',
        location: 'Glasgow',
        contactName: 'Alice Henderson',
        contactEmail: 'alice@example.com',
        status: 'Open',
        postedBy: user._id,
      },
      {
        title: 'Fixing flickering living room ceiling lights',
        description: 'Two of our main living room LED ceiling lights have started flickering intermittently. We need a professional electrician to check the wiring and dimmer switch.',
        category: 'Electrical',
        location: 'Glasgow',
        contactName: 'David Miller',
        contactEmail: 'david.m@example.com',
        status: 'In Progress',
        postedBy: user._id,
      },
      {
        title: 'Paint master bedroom walls and ceiling',
        description: 'Looking to paint a standard sized master bedroom. Walls need two coats of neutral white/beige, and the ceiling needs a fresh coat. We will supply the paint.',
        category: 'Painting',
        location: 'Edinburgh',
        contactName: 'Sarah Jenkins',
        contactEmail: 'sarah.j@example.com',
        status: 'Open',
        postedBy: user._id,
      },
      {
        title: 'Fit new oak internal doors',
        description: 'Need to replace 4 standard interior hollow doors with solid oak pre-finished doors. Hinges and handles need to be fitted as well.',
        category: 'Joinery',
        location: 'Glasgow',
        contactName: 'Robert Bruce',
        contactEmail: 'robert.b@example.com',
        status: 'Open',
        postedBy: user._id,
      },
      {
        title: 'Overgrown back garden cleanup and lawn mowing',
        description: 'Our backyard has become completely overgrown over winter. Need weeds cleared, bushes trimmed back, and the lawn mowed and edged.',
        category: 'Gardening',
        location: 'Paisley',
        contactName: 'Fiona McGregor',
        contactEmail: 'fiona.mc@example.com',
        status: 'Closed',
        postedBy: user._id,
      },
      {
        title: 'End of tenancy deep clean for 2-bed apartment',
        description: 'Need a thorough end-of-tenancy clean for a 2-bedroom flat. Includes kitchen appliances (oven, fridge), bathroom descaling, window interiors, and carpet vacuuming.',
        category: 'Cleaning',
        location: 'Edinburgh',
        contactName: 'Michael Chang',
        contactEmail: 'm.chang@example.com',
        status: 'Open',
        postedBy: user._id,
      },
      {
        title: 'Install outdoor security camera wiring',
        description: 'Need assistance routing power and ethernet wires through the loft for three external smart security cameras on the front and rear walls.',
        category: 'Electrical',
        location: 'Glasgow',
        contactName: 'Stuart Campbell',
        contactEmail: 'stuart.c@example.com',
        status: 'Open',
        postedBy: user._id,
      },
      {
        title: 'Repair broken wooden fence panels',
        description: 'Strong winds have knocked down two panels of our wooden garden fence. Need the posts reinforced and two new panels installed to restore privacy.',
        category: 'Joinery',
        location: 'Glasgow',
        contactName: 'Emma Watson',
        contactEmail: 'emma@example.com',
        status: 'In Progress',
        postedBy: user._id,
      },
    ];

    await JobRequest.insertMany(jobs);
    console.log(`Successfully seeded ${jobs.length} job requests!`);

    mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
