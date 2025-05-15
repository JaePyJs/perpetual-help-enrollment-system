// Subject data for enrollment system
const availableSubjects = [
  {
    id: 1,
    code: 'IT201',
    title: 'Data Structures and Algorithms',
    description: 'This course covers the fundamental data structures and algorithms used in computer science.',
    units: 3,
    lecUnits: 2,
    labUnits: 1,
    prerequisites: ['IT102'],
    corequisites: [],
    sections: [
      {
        id: 'A',
        schedule: 'M/W 9:00AM-10:30AM',
        room: 'Rm 305',
        instructor: 'Dr. Santos',
        slots: {
          available: 10,
          total: 40
        }
      },
      {
        id: 'B',
        schedule: 'T/Th 1:00PM-2:30PM',
        room: 'Rm 307',
        instructor: 'Prof. Garcia',
        slots: {
          available: 5,
          total: 40
        }
      }
    ]
  },
  {
    id: 2,
    code: 'IT202',
    title: 'Information Management',
    description: 'This course covers database design, implementation, and management.',
    units: 3,
    lecUnits: 2,
    labUnits: 1,
    prerequisites: [],
    corequisites: [],
    sections: [
      {
        id: 'A',
        schedule: 'M/W 1:00PM-2:30PM',
        room: 'Rm 305',
        instructor: 'Prof. Reyes',
        slots: {
          available: 15,
          total: 40
        }
      },
      {
        id: 'B',
        schedule: 'T/Th 9:00AM-10:30AM',
        room: 'Rm 307',
        instructor: 'Prof. Luna',
        slots: {
          available: 20,
          total: 40
        }
      }
    ]
  },
  {
    id: 3,
    code: 'IT203',
    title: 'Web Development',
    description: 'This course covers the fundamentals of web development including HTML, CSS, and JavaScript.',
    units: 3,
    lecUnits: 2,
    labUnits: 1,
    prerequisites: ['IT102'],
    corequisites: [],
    sections: [
      {
        id: 'A',
        schedule: 'M/W 3:00PM-4:30PM',
        room: 'Rm 305',
        instructor: 'Prof. Cruz',
        slots: {
          available: 8,
          total: 40
        }
      },
      {
        id: 'B',
        schedule: 'T/Th 10:30AM-12:00PM',
        room: 'Rm 307',
        instructor: 'Dr. Bautista',
        slots: {
          available: 12,
          total: 40
        }
      }
    ]
  },
  {
    id: 4,
    code: 'IT204',
    title: 'Object-Oriented Programming',
    description: 'This course covers object-oriented programming concepts and principles.',
    units: 3,
    lecUnits: 2,
    labUnits: 1,
    prerequisites: ['IT102', 'IT101'],
    corequisites: [],
    sections: [
      {
        id: 'A',
        schedule: 'T/Th 1:00PM-2:30PM',
        room: 'Rm 305',
        instructor: 'Dr. Santos',
        slots: {
          available: 18,
          total: 40
        }
      },
      {
        id: 'B',
        schedule: 'M/W 9:00AM-10:30AM',
        room: 'Rm 307',
        instructor: 'Prof. Garcia',
        slots: {
          available: 22,
          total: 40
        }
      }
    ]
  },
  {
    id: 5,
    code: 'IT205',
    title: 'Network Fundamentals',
    description: 'This course introduces the basic concepts of computer networking.',
    units: 3,
    lecUnits: 2,
    labUnits: 1,
    prerequisites: ['IT201'],
    corequisites: [],
    sections: [
      {
        id: 'A',
        schedule: 'W/F 7:30AM-9:00AM',
        room: 'Rm 405',
        instructor: 'Dr. Mendoza',
        slots: {
          available: 25,
          total: 40
        }
      },
      {
        id: 'B',
        schedule: 'T/Th 3:00PM-4:30PM',
        room: 'Rm 407',
        instructor: 'Prof. Torres',
        slots: {
          available: 28,
          total: 40
        }
      }
    ]
  },
  {
    id: 6,
    code: 'GE103',
    title: 'Purposive Communication',
    description: 'This course develops students\' communication skills in various contexts.',
    units: 3,
    lecUnits: 3,
    labUnits: 0,
    prerequisites: [],
    corequisites: [],
    sections: [
      {
        id: 'A',
        schedule: 'M/W 3:00PM-4:30PM',
        room: 'Rm 205',
        instructor: 'Prof. Ocampo',
        slots: {
          available: 15,
          total: 40
        }
      },
      {
        id: 'B',
        schedule: 'T/Th 10:30AM-12:00PM',
        room: 'Rm 207',
        instructor: 'Prof. Robles',
        slots: {
          available: 10,
          total: 40
        }
      }
    ]
  },
  {
    id: 7,
    code: 'GE104',
    title: 'Mathematics in the Modern World',
    description: 'This course covers mathematical concepts and their applications in modern society.',
    units: 3,
    lecUnits: 3,
    labUnits: 0,
    prerequisites: [],
    corequisites: [],
    sections: [
      {
        id: 'A',
        schedule: 'M/W 7:30AM-9:00AM',
        room: 'Rm 105',
        instructor: 'Dr. Villanueva',
        slots: {
          available: 20,
          total: 40
        }
      },
      {
        id: 'B',
        schedule: 'T/Th 3:00PM-4:30PM',
        room: 'Rm 107',
        instructor: 'Prof. Ramos',
        slots: {
          available: 18,
          total: 40
        }
      }
    ]
  },
  {
    id: 8,
    code: 'GE105',
    title: 'Understanding the Self',
    description: 'This course explores the different dimensions and aspects of the self.',
    units: 3,
    lecUnits: 3,
    labUnits: 0,
    prerequisites: [],
    corequisites: [],
    sections: [
      {
        id: 'A',
        schedule: 'T/Th 7:30AM-9:00AM',
        room: 'Rm 205',
        instructor: 'Dr. Santos',
        slots: {
          available: 30,
          total: 40
        }
      },
      {
        id: 'B',
        schedule: 'W/F 1:00PM-2:30PM',
        room: 'Rm 207',
        instructor: 'Prof. Cruz',
        slots: {
          available: 25,
          total: 40
        }
      }
    ]
  }
];
