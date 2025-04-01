import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaSave, FaArrowLeft, FaCalendarAlt, FaClock } from 'react-icons/fa';
import './Availableemployees.css';

const AvailableEmployees = () => {
  const navigate = useNavigate();
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [displayedEmployees, setDisplayedEmployees] = useState([]);
  const [branchEmployees, setBranchEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSession, setSelectedSession] = useState('AM'); // Default to AM
  const [searchTerm, setSearchTerm] = useState('');
  const [userData, setUserData] = useState(null);
  const [todayDate, setTodayDate] = useState('');


  // Department-specific employee data
  const departmentEmployees = {
    'CSE': [
      { id: '41001', name: 'Dr. Sreelatha Malempati', department: 'CSE', designation: 'Professor & HoD' },
      { id: '41002', name: 'Dr. Chaparala Aparna', department: 'CSE', designation: 'Professor' },
      { id: '41003', name: 'Dr. R. Lakshmi Tulasi', department: 'CSE', designation: 'Professor' },
      { id: '41004', name: 'Dr. Boyapati Varaprasad Rao', department: 'CSE', designation: 'Professor' },
      { id: '41005', name: 'Dr. Meda Srikanth', department: 'CSE', designation: 'Professor' },
      { id: '41006', name: 'Sri. Chekka Ratna Babu', department: 'CSE', designation: 'Associate Professor' },
      { id: '41007', name: 'Dr. K. Siva Kumar', department: 'CSE', designation: 'Associate Professor' },
      { id: '41008', name: 'Dr. S J R K Padminivalli V', department: 'CSE', designation: 'Associate Professor' },
      { id: '41009', name: 'Sri. Eluri Ramesh', department: 'CSE', designation: 'Assistant Professor' },
      { id: '41010', name: 'Smt. Mandadi Vasavi', department: 'CSE', designation: 'Assistant Professor' },
      { id: '41011', name: 'Mr. Mabubashar', department: 'CSE', designation: 'Assistant Professor' },
      { id: '41012', name: 'Sri. Pulicherla Siva Prasad', department: 'CSE', designation: 'Assistant Professor' },
      { id: '41013', name: 'Sri. Madamanchi Brahmaiah', department: 'CSE', designation: 'Assistant Professor' },
      { id: '41014', name: 'Smt. Challa Vijaya Madhavi Lakshmi', department: 'CSE', designation: 'Assistant Professor' },
      { id: '41015', name: 'Dr. Zarapala Sunitha Bai', department: 'CSE', designation: 'Assistant Professor' },
      { id: '41016', name: 'Smt. Bezawada Manasa', department: 'CSE', designation: 'Assistant Professor' },
      { id: '41017', name: 'Sri. Paladugu Rama Krishna', department: 'CSE', designation: 'Assistant Professor' },
      { id: '41018', name: 'Smt. Zareena Noorbasha', department: 'CSE', designation: 'Assistant Professor' },
      { id: '41019', name: 'Ms. Cherukuri Vijaya Lakshmi', department: 'CSE', designation: 'Assistant Professor' },
      { id: '41020', name: 'Ms. Paruchuri Anuradha', department: 'CSE', designation: 'Assistant Professor' },
      { id: '41021', name: 'Sri. Sajja Karthik', department: 'CSE', designation: 'Assistant Professor' },
      { id: '41022', name: 'Ms. Indlamuri Bhargavi', department: 'CSE', designation: 'Assistant Professor' },
      { id: '41023', name: 'Ms. Gunturi Sriteja', department: 'CSE', designation: 'Assistant Professor' },
      { id: '41024', name: 'Ms. Gorijala Gowthami', department: 'CSE', designation: 'Assistant Professor' },
      { id: '41025', name: 'Ms. Shaik Jannathul Fridosh', department: 'CSE', designation: 'Assistant Professor' },
      { id: '41026', name: 'Ms. Shaik Rajiya', department: 'CSE', designation: 'Assistant Professor' },
      { id: '41027', name: 'Mr. Veravalli Chakravarthi', department: 'CSE', designation: 'Assistant Professor' },
      { id: '41028', name: 'Mr. Satuluri Manoj Kumar', department: 'CSE', designation: 'Assistant Professor' },
      { id: '41029', name: 'Smt. Chanamala Sukognya', department: 'CSE', designation: 'Assistant Professor' },
      { id: '41030', name: 'Smt. Gaddam Mounika', department: 'CSE', designation: 'Assistant Professor' },
      { id: '41031', name: 'Mrs. Medikonduru Maithili Saisree', department: 'CSE', designation: 'Assistant Professor' },
      { id: '41032', name: 'Mr. Nimmagadda Chandra Sekhar', department: 'CSE', designation: 'Assistant Professor' },
      { id: '41033', name: 'Smt. Alekhya Kancharla', department: 'CSE', designation: 'Assistant Professor' },
      { id: '41034', name: 'Dr. Bhagya Lakshmi Nandipati', department: 'CSE', designation: 'Assistant Professor' },
      { id: '41035', name: 'Smt. Jyothi Kameswari U', department: 'CSE', designation: 'Assistant Professor' },
      { id: '41036', name: 'Smt. Dhanekula Tejaswini', department: 'CSE', designation: 'Assistant Professor' },
      { id: '41037', name: 'Mr. Manne Rajesh', department: 'CSE', designation: 'Assistant Professor' }


    ],
    'CSBS': [
      { id: '18101', name: 'Dr. Ayyagari Srinagesh', department: 'CSBS', designation: 'Professor & HoD' },
      { id: '18102', name: 'Dr. T. Anuradha', department: 'CSBS', designation: 'Associate Professor' },
      { id: '18103', name: 'Dr. Lakshmikanth Paleti', department: 'CSBS', designation: 'Associate Professor' },
      { id: '18104', name: 'Dr. Srinivasa Rao Mandalapu', department: 'CSBS', designation: 'Assistant Professor' },
      { id: '18105', name: 'Mrs. D. Deepthi', department: 'CSBS', designation: 'Assistant Professor' },
      { id: '18106', name: 'Mrs. Jagarlamudi Amala', department: 'CSBS', designation: 'Assistant Professor' },
      { id: '18107', name: 'Mrs. Nalluri Bhargavi', department: 'CSBS', designation: 'Assistant Professor' },
      { id: '18108', name: 'Mrs. Annavarapu Mahalakshmi', department: 'CSBS', designation: 'Assistant Professor' }
    ],
    'CSE(DS)': [
      { id: '610001', name: 'Dr. M.V.P. Chandra Sekhara Rao', department: 'CSE(DS)', designation: 'Professor & HOD' },
      { id: '610002', name: 'Dr. Sudha Sree Chekuri', department: 'CSE(DS)', designation: 'Associate Professor' },
      { id: '610003', name: 'Dr. Ganji Ramanjaiah', department: 'CSE(DS)', designation: 'Associate Professor' },
      { id: '610004', name: 'Dr. Popuri Srinivasa Rao', department: 'CSE(DS)', designation: 'Associate Professor' },
      { id: '610005', name: 'Dr. Riaz Shaik', department: 'CSE(DS)', designation: 'Associate Professor' },
      { id: '610006', name: 'Mr. Peddi Anudeep', department: 'CSE(DS)', designation: 'Assistant Professor' },
      { id: '610007', name: 'Mr. Subramanyam Kunisetty', department: 'CSE(DS)', designation: 'Assistant Professor' },
      { id: '610008', name: 'Mrs. Aravinda Kasukurthi', department: 'CSE(DS)', designation: 'Assistant Professor' },
      { id: '610009', name: 'Mr. Ramakrishna Badiguntla', department: 'CSE(DS)', designation: 'Assistant Professor' },
      { id: '610010', name: 'Mr. Rallabandi Ch S N P Sairam', department: 'CSE(DS)', designation: 'Assistant Professor' },
      { id: '610011', name: 'Mr. A V Krishnarao Padyala', department: 'CSE(DS)', designation: 'Assistant Professor' },
      { id: '610012', name: 'Mrs. Swathi Nelavalli', department: 'CSE(DS)', designation: 'Assistant Professor' },
      { id: '610013', name: 'Mrs. Padmaja Inturi', department: 'CSE(DS)', designation: 'Assistant Professor' },
      { id: '610014', name: 'Ms. Annam Manjusha', department: 'CSE(DS)', designation: 'Assistant Professor' },
      { id: '610015', name: 'Mr. Palukuri Punnarao', department: 'CSE(DS)', designation: 'Assistant Professor' }
    ],
    'CSE(AI&ML)': [
      { id: '71001', name: 'Prof. Gatram Rama Mohan Babu', department: 'CSE(AI&ML)', designation: 'Professor & Head' },
      { id: '71002', name: 'Prof. N. Venkateswara Rao', department: 'CSE(AI&ML)', designation: 'Professor' },
      { id: '71003', name: 'Dr. Palacharla Ravikumar', department: 'CSE(AI&ML)', designation: 'Associate Professor' },
      { id: '71004', name: 'Mr. Annapureddy Rama Prathap Reddy', department: 'CSE(AI&ML)', designation: 'Assistant Professor' },
      { id: '71005', name: 'Smt. Venkata Anusha Kolluru', department: 'CSE(AI&ML)', designation: 'Assistant Professor' },
      { id: '71006', name: 'Sri. Narne Srikanth', department: 'CSE(AI&ML)', designation: 'Assistant Professor' },
      { id: '71007', name: 'Sri. Onteru Srinivas', department: 'CSE(AI&ML)', designation: 'Assistant Professor' },
      { id: '71008', name: 'Mr. Reddy Veeramohanrao', department: 'CSE(AI&ML)', designation: 'Assistant Professor' },
      { id: '71009', name: 'Mrs. Dandamudi Srilatha', department: 'CSE(AI&ML)', designation: 'Assistant Professor' },
      { id: '71010', name: 'Mrs. K. Bhagya Lalitha', department: 'CSE(AI&ML)', designation: 'Assistant Professor' },
      { id: '71011', name: 'Sri. Mannava Vijaya Bhaskar', department: 'CSE(AI&ML)', designation: 'Assistant Professor' }
    ],
    'CSE(IOT)': [
      { id: '81001', name: 'Prof. Nallamothu Nagamalleswara Rao', department: 'CSE(IOT)', designation: 'Professor & Head' },
      { id: '81002', name: 'Dr. Nageswara Rao Eluri', department: 'CSE(IOT)', designation: 'Associate Professor' },
      { id: '81003', name: 'Mr. Burla Nagaraju', department: 'CSE(IOT)', designation: 'Assistant Professor' },
      { id: '81004', name: 'Mr. Psam Prudhvi Kiran', department: 'CSE(IOT)', designation: 'Assistant Professor' }
    ],
    'IT': [
      { id: '91001', name: 'Dr. Atuluri Sri Krishna', department: 'IT', designation: 'Professor & HOD' },
      { id: '91002', name: 'Dr. B Hemanth Kumar', department: 'IT', designation: 'Professor' },
      { id: '91003', name: 'Sri G. Srinivasa Rao', department: 'IT', designation: 'Associate Professor' },
      { id: '91004', name: 'Dr. M. Pompapathi', department: 'IT', designation: 'Associate Professor' },
      { id: '91005', name: 'Dr. V. Sesha Srinivas', department: 'IT', designation: 'Associate Professor' },
      { id: '91006', name: 'Dr. Yaswanth Kumar Alapati', department: 'IT', designation: 'Associate Professor' },
      { id: '91007', name: 'Dr. Bh Krishna Mohan', department: 'IT', designation: 'Associate Professor' },
      { id: '91008', name: 'Dr. Gadde Swetha', department: 'IT', designation: 'Associate Professor' },
      { id: '91009', name: 'Sri B. Venkateswarlu', department: 'IT', designation: 'Associate Professor' },
      { id: '91010', name: 'Sri Madamanchi Venkata Bhujanga Rao', department: 'IT', designation: 'Assistant Professor' },
      { id: '91011', name: 'Dr. N. Neelima', department: 'IT', designation: 'Assistant Professor' },
      { id: '91012', name: 'Smt. I. Naga Padmaja', department: 'IT', designation: 'Assistant Professor' },
      { id: '91013', name: 'Smt. B. Manasa', department: 'IT', designation: 'Assistant Professor' },
      { id: '91014', name: 'Sri Venkata Srinivasu Veesam', department: 'IT', designation: 'Assistant Professor' },
      { id: '91015', name: 'Sri Bandaru Satish Babu', department: 'IT', designation: 'Assistant Professor' },
      { id: '91016', name: 'Smt. N. Lakshmi Haritha', department: 'IT', designation: 'Assistant Professor' },
      { id: '91017', name: 'Smt. D. Swathi', department: 'IT', designation: 'Assistant Professor' },
      { id: '91018', name: 'Smt. D. Swapna', department: 'IT', designation: 'Assistant Professor' },
      { id: '91019', name: 'Smt. D. Surekha', department: 'IT', designation: 'Assistant Professor' },
      { id: '91020', name: 'Smt. K. Navya', department: 'IT', designation: 'Assistant Professor' },
      { id: '91021', name: 'Smt. N. Gayatri Saranya', department: 'IT', designation: 'Assistant Professor' },
      { id: '91022', name: 'Sri A. Sambasiva Rao', department: 'IT', designation: 'Assistant Professor' },
      { id: '91023', name: 'Smt. Kotha Chandana', department: 'IT', designation: 'Assistant Professor' },
      { id: '91024', name: 'Smt. Y. Meena', department: 'IT', designation: 'Assistant Professor' },
      { id: '91025', name: 'Sri. J. Madhan Kumar', department: 'IT', designation: 'Assistant Professor' }
    ],
    'ECE': [
      { id: '21001', name: 'Dr. T. Ranga Babu', department: 'ECE', designation: 'Professor & Head' },
      { id: '21002', name: 'Dr. M.V. Siva Prasad', department: 'ECE', designation: 'Professor' },
      { id: '21003', name: 'Dr. G. Sudhavani', department: 'ECE', designation: 'Professor' },
      { id: '21004', name: 'Dr. J. Ravindranadh', department: 'ECE', designation: 'Professor' },
      { id: '21005', name: 'Dr. M. Satya Sai Ram', department: 'ECE', designation: 'Professor' },
      { id: '21006', name: 'Dr. N. Renuka', department: 'ECE', designation: 'Professor' },
      { id: '21007', name: 'Dr. P.P.S. Subhashini', department: 'ECE', designation: 'Professor' },
      { id: '21008', name: 'Dr. P. Suresh Kumar', department: 'ECE', designation: 'Associate Professor' },
      { id: '21009', name: 'Dr. D. Eswara Chaitanya', department: 'ECE', designation: 'Associate Professor' },
      { id: '21010', name: 'Dr. X. Ascar Davix', department: 'ECE', designation: 'Associate Professor' },
      { id: '21011', name: 'Dr. K. Upendra Chowdary', department: 'ECE', designation: 'Associate Professor' },
      { id: '21012', name: 'Dr. S. Ramesh Babu', department: 'ECE', designation: 'Associate Professor' },
      { id: '21013', name: 'Dr. P. Siva Prasad', department: 'ECE', designation: 'Associate Professor' },
      { id: '21014', name: 'Dr. K. Sravanthi', department: 'ECE', designation: 'Associate Professor' },
      { id: '21015', name: 'Dr. T. Suneetha', department: 'ECE', designation: 'Associate Professor' },
      { id: '21017', name: 'Mr. A. Murali Krishna', department: 'ECE', designation: 'Assistant Professor' },
      { id: '21018', name: 'Smt. M. Sunitha', department: 'ECE', designation: 'Assistant Professor' },
      { id: '21019', name: 'Sri. P.V. Krishna Kanth', department: 'ECE', designation: 'Assistant Professor' },
      { id: '21020', name: 'Mr. K. Anil Kumar', department: 'ECE', designation: 'Assistant Professor' },
      { id: '21021', name: 'Mr. K. Ashok Kumar', department: 'ECE', designation: 'Assistant Professor' },
      { id: '21022', name: 'Dr. D. Jagadeesh', department: 'ECE', designation: 'Assistant Professor' },
      { id: '21023', name: 'Mr. N. Pavan Kumar', department: 'ECE', designation: 'Assistant Professor' },
      { id: '21024', name: 'Dr. N. Sudheer Kumar', department: 'ECE', designation: 'Assistant Professor' },
      { id: '21025', name: 'Mr. K. Sudhakar', department: 'ECE', designation: 'Assistant Professor' },
      { id: '21026', name: 'Mr. Ch. Jayaram', department: 'ECE', designation: 'Assistant Professor' },
      { id: '21027', name: 'Smt. Makkapati Himaja', department: 'ECE', designation: 'Assistant Professor' },
      { id: '21028', name: 'Smt. Koritala Nagavardhani', department: 'ECE', designation: 'Assistant Professor' },
      { id: '21029', name: 'Smt. P. Bala Prasanthi', department: 'ECE', designation: 'Assistant Professor' },
      { id: '21030', name: 'Mr. B. Sriram', department: 'ECE', designation: 'Assistant Professor' },
      { id: '21031', name: 'Mr. M. Jaya Prakash', department: 'ECE', designation: 'Assistant Professor' },
      { id: '21032', name: 'Smt. Y. Naveena', department: 'ECE', designation: 'Assistant Professor' },
      { id: '21033', name: 'Mr. V. Prakash', department: 'ECE', designation: 'Assistant Professor' },
      { id: '21034', name: 'Smt. V. Anusha', department: 'ECE', designation: 'Assistant Professor' },
      { id: '21035', name: 'Smt. Pudota Bindu Sri', department: 'ECE', designation: 'Assistant Professor' },
      { id: '21036', name: 'Smt. Nuthalapati Hemalatha', department: 'ECE', designation: 'Assistant Professor' },
      { id: '21037', name: 'Ms. Pasam Pavithra', department: 'ECE', designation: 'Assistant Professor' },
      { id: '21038', name: 'Sri. D. Pushpa Rao', department: 'ECE', designation: 'Assistant Professor' },
      { id: '21039', name: 'Ms. T. Pavani', department: 'ECE', designation: 'Assistant Professor' },
      { id: '21040', name: 'Dr. P. Sai Vinay Kumar', department: 'ECE', designation: 'Assistant Professor' }
    ],
    'EEE': [
      { id: '31001', name: 'Dr. Koritala Chandra Sekhar', department: 'EEE', designation: 'Professor & HOD' },
      { id: '31002', name: 'Dr. Katragadda Swarnasri', department: 'EEE', designation: 'Professor' },
      { id: '31003', name: 'Dr. Korrapati Radha Rani', department: 'EEE', designation: 'Professor' },
      { id: '31004', name: 'Dr. G. Sambasiva Rao', department: 'EEE', designation: 'Professor' },
      { id: '31005', name: 'Dr. N.C. Kotaiah', department: 'EEE', designation: 'Professor' },
      { id: '31006', name: 'Dr. Ramakoteswararao Alla', department: 'EEE', designation: 'Associate Professor' },
      { id: '31007', name: 'Dr. N. Chaitanya', department: 'EEE', designation: 'Associate Professor' },
      { id: '31008', name: 'Dr. Y. Ravindranath Tagore', department: 'EEE', designation: 'Associate Professor' },
      { id: '31009', name: 'Dr. G.V. Prasanna Anjaneyulu', department: 'EEE', designation: 'Associate Professor' },
      { id: '31010', name: 'Dr. Mallipeddi Anitha', department: 'EEE', designation: 'Associate Professor' },
      { id: '31011', name: 'Dr. Ponnam Venkata Kishore Babu', department: 'EEE', designation: 'Associate Professor' },
      { id: '31012', name: 'Dr. Tripura Pidikiti', department: 'EEE', designation: 'Associate Professor' },
      { id: '31013', name: 'Dr. Ch. Ranga Rao', department: 'EEE', designation: 'Associate Professor' },
      { id: '31014', name: 'Dr. Dharani Kumar Narne', department: 'EEE', designation: 'Associate Professor' },
      { id: '31015', name: 'Dr. Sumanth Yamparala', department: 'EEE', designation: 'Associate Professor' },
      { id: '31016', name: 'Dr. Sarayu Vunnam', department: 'EEE', designation: 'Assistant Professor' },
      { id: '31017', name: 'Mr. B. Sarath Chandra', department: 'EEE', designation: 'Assistant Professor' },
      { id: '31018', name: 'Mr. Veeranjaneyulu Gopu', department: 'EEE', designation: 'Assistant Professor' },
      { id: '31019', name: 'Dr. P. Venkata Mahesh', department: 'EEE', designation: 'Assistant Professor' },
      { id: '31020', name: 'Mr. Rayaprolu Mallikharjuna Raghuveer', department: 'EEE', designation: 'Assistant Professor' },
      { id: '31021', name: 'Mrs. Tr Chandni', department: 'EEE', designation: 'Assistant Professor' },
      { id: '31022', name: 'Mrs. Velaga Sree Vidya', department: 'EEE', designation: 'Assistant Professor' },
      { id: '31023', name: 'Mrs. Ginjupalli Renuka', department: 'EEE', designation: 'Assistant Professor' },
      { id: '31024', name: 'Mrs. Tubati Udayakrishna', department: 'EEE', designation: 'Assistant Professor' },
      { id: '31025', name: 'Ms. Thota Siva Hemalatha', department: 'EEE', designation: 'Assistant Professor' },
      { id: '31026', name: 'Mr. Kalluri Raviteja', department: 'EEE', designation: 'Assistant Professor' },
      { id: '31027', name: 'Ms. Naganjani Kandula', department: 'EEE', designation: 'Assistant Professor' },
      { id: '31028', name: 'Ms. Yadavalli Sushma', department: 'EEE', designation: 'Assistant Professor' },
      { id: '31029', name: 'Ms. V Bhavyashree', department: 'EEE', designation: 'Assistant Professor' },
      { id: '31030', name: 'Ms. D. Malathi', department: 'EEE', designation: 'Assistant Professor' },
      { id: '31031', name: 'Ms. Bhavana Deviraddy', department: 'EEE', designation: 'Assistant Professor' },
      { id: '31032', name: 'Ms. Sirisha Annam', department: 'EEE', designation: 'Assistant Professor' }
    ],
    'CIVIL': [
      { id: '510001', name: 'Dr. K.S. Sai Ram', department: 'CIVIL', designation: 'Professor' },
      { id: '510002', name: 'Dr. A. Srinivasa Prasad', department: 'CIVIL', designation: 'Professor & Head' },
      { id: '510003', name: 'Sri. P.V.S. Maruthi Krishna', department: 'CIVIL', designation: 'Associate Professor' },
      { id: '510004', name: 'Sri. Ramineni Surendra Babu', department: 'CIVIL', designation: 'Associate Professor' },
      { id: '510005', name: 'Dr. R. Chandra Mohan', department: 'CIVIL', designation: 'Associate Professor' },
      { id: '510006', name: 'Dr. J. Usha Kranti', department: 'CIVIL', designation: 'Associate Professor' },
      { id: '510007', name: 'Dr. Ponduri Samatha Chowdary', department: 'CIVIL', designation: 'Associate Professor' },
      { id: '510008', name: 'Dr. K. Leela Krishna', department: 'CIVIL', designation: 'Associate Professor' },
      { id: '510009', name: 'Dr. L.N.K. Sai Madupu', department: 'CIVIL', designation: 'Associate Professor' },
      { id: '510010', name: 'Dr. B. Kesava Rao', department: 'CIVIL', designation: 'Associate Professor' },
      { id: '510011', name: 'Dr. N. Venkata Sairam Kumar', department: 'CIVIL', designation: 'Associate Professor' },
      { id: '510012', name: 'Sri. M Srikanth Kumar', department: 'CIVIL', designation: 'Assistant Professor' },
      { id: '510013', name: 'Sri. S.V. Satyanarayana', department: 'CIVIL', designation: 'Assistant Professor' },
      { id: '510014', name: 'Ms. Y. Madhavi', department: 'CIVIL', designation: 'Assistant Professor' },
      { id: '510015', name: 'Smt. Nandipati Tejaswini', department: 'CIVIL', designation: 'Assistant Professor' },
      { id: '510016', name: 'Sri. Rachamallu Vaishnava Kumar', department: 'CIVIL', designation: 'Assistant Professor' },
      { id: '510017', name: 'Smt. Palepu Srilakshmi', department: 'CIVIL', designation: 'Assistant Professor' },
      { id: '510018', name: 'Sri Gunnam Sanijya', department: 'CIVIL', designation: 'Assistant Professor' },
      { id: '510019', name: 'Dr. Bypaneni Krishna Chaitanya', department: 'CIVIL', designation: 'Assistant Professor' },
      { id: '510021', name: 'Sri. Yenigandla Naga Mahesh', department: 'CIVIL', designation: 'Assistant Professor' },
      { id: '510022', name: 'Sri. B. Yellamanda Rao', department: 'CIVIL', designation: 'Assistant Professor' },
      { id: '510023', name: 'Sri. B. Durga Prasad', department: 'CIVIL', designation: 'Assistant Professor' },
      { id: '510024', name: 'Ms. A. Bhavana Chowdary', department: 'CIVIL', designation: 'Assistant Professor' },
      { id: '510025', name: 'Mr. Sk. Deen Mohammad', department: 'CIVIL', designation: 'Assistant Professor' },
      { id: '510026', name: 'Mr. Sk. Johny Ibrahim', department: 'CIVIL', designation: 'Assistant Professor' },
      { id: '510027', name: 'Mr. A. Vinod Reddy', department: 'CIVIL', designation: 'Assistant Professor' },
      { id: '510028', name: 'Smt. M. Prathyusha', department: 'CIVIL', designation: 'Assistant Professor' },
      { id: '510029', name: 'Ms. J. Venkata Susanka', department: 'CIVIL', designation: 'Assistant Professor' },
      { id: '510030', name: 'Mr. TDNVS Akhil Babu', department: 'CIVIL', designation: 'Assistant Professor' },
      { id: '510031', name: 'Mr. J. Akhil', department: 'CIVIL', designation: 'Assistant Professor' }
    ],
    'MECH': [
      { id: '11001', name: 'Dr. D.V.V. Krishna Prasad', department: 'MECH', designation: 'Professor and HOD' },
      { id: '11002', name: 'Dr. V. Chittaranjan Das', department: 'MECH', designation: 'Professor' },
      { id: '11003', name: 'Dr. G. Srinivasa Rao', department: 'MECH', designation: 'Professor' },
      { id: '11004', name: 'Dr. C. Srinivas', department: 'MECH', designation: 'Professor' },
      { id: '11005', name: 'Dr. B. Ramgopal Reddy', department: 'MECH', designation: 'Professor' },
      { id: '11006', name: 'Dr. N.V.V.S. Sudheer', department: 'MECH', designation: 'Professor' },
      { id: '11007', name: 'Dr. K. Bala Prasad', department: 'MECH', designation: 'Professor' },
      { id: '11008', name: 'Dr. G. Chaitanya', department: 'MECH', designation: 'Associate Professor' },
      { id: '11009', name: 'Dr. N. Govind', department: 'MECH', designation: 'Associate Professor' },
      { id: '11010', name: 'Dr. K. Praveen Kumar', department: 'MECH', designation: 'Associate Professor' },
      { id: '11011', name: 'Dr. Radhika Sajja', department: 'MECH', designation: 'Associate Professor' },
      { id: '11012', name: 'Dr. V. Ramakoteswara Rao', department: 'MECH', designation: 'Associate Professor' },
      { id: '11013', name: 'Dr. R. Sreenivasulu', department: 'MECH', designation: 'Associate Professor' },
      { id: '11014', name: 'Dr. P. Suresh Kumar', department: 'MECH', designation: 'Associate Professor' },
      { id: '11015', name: 'Dr. D. Swapna', department: 'MECH', designation: 'Associate Professor' },
      { id: '11016', name: 'Mr. Patibandla Rakesh Chowdary', department: 'MECH', designation: 'Assistant Professor' },
      { id: '11017', name: 'Mr. Muttineni V Nagarjuna', department: 'MECH', designation: 'Assistant Professor' },
      { id: '11018', name: 'Dr. G. Kishore Chowdari', department: 'MECH', designation: 'Associate Professor' },
      { id: '11019', name: 'Mr. Basheer Ahmed Shaik', department: 'MECH', designation: 'Assistant Professor' },
      { id: '11020', name: 'Ms. P. Sravani', department: 'MECH', designation: 'Assistant Professor' },
      { id: '11021', name: 'Mr. Sakhamuri Venkata Kishore', department: 'MECH', designation: 'Assistant Professor' },
      { id: '11022', name: 'Mr. Venkata Pavan Kumar Akula', department: 'MECH', designation: 'Assistant Professor' },
      { id: '11023', name: 'Mr. Natha Arun Kumar', department: 'MECH', designation: 'Assistant Professor' },
      { id: '11024', name: 'Mr. Bobbili Praveen', department: 'MECH', designation: 'Assistant Professor' },
      { id: '11025', name: 'Dr. Muddu Alaparthi', department: 'MECH', designation: 'Assistant Professor' }
    ],
    'Chemical': [
  { id: '12001', name: 'Dr. K. Ramesh Chandra', department: 'Chemical', designation: 'Associate Professor & HOD i/c' },
  { id: '12002', name: 'Dr. N V Satyanarayana Derangula', department: 'Chemical', designation: 'Associate Professor' },
  { id: '12003', name: 'Dr. Rohinikumar Palavalasa', department: 'Chemical', designation: 'Associate Professor' },
  { id: '12004', name: 'Dr. K. Sobha', department: 'Chemical', designation: 'Professor' },
  { id: '12005', name: 'Smt. Lakshmi Jayanthi Juturi', department: 'Chemical', designation: 'Assistant Professor' },
  { id: '12006', name: 'Sri Krosuri Siva Prasada Rao', department: 'Chemical', designation: 'Assistant Professor' },
  { id: '12007', name: 'Dr. G Kavitha', department: 'Chemical', designation: 'Assistant Professor' },
  { id: '12008', name: 'Dr. Kagita Srikanthbheemareddy', department: 'Chemical', designation: 'Assistant Professor' },
  { id: '12009', name: 'Sri Yallamanda Koritipati', department: 'Chemical', designation: 'Assistant Professor' },
  { id: '12010', name: 'Smt. Bhargavi Devi Manepalli', department: 'Chemical', designation: 'Assistant Professor' },
  { id: '12011', name: 'Dr. Bhavani Yellankula', department: 'Chemical', designation: 'Assistant Professor' },
  { id: '12012', name: 'Smt. Pendyala Aparna', department: 'Chemical', designation: 'Assistant Professor' },
  { id: '12013', name: 'Smt. Aradhyula Srilakshmi Tirupatamma', department: 'Chemical', designation: 'Assistant Professor' },
  { id: '12014', name: 'Smt. Shubhra Shakya', department: 'Chemical', designation: 'Assistant Professor' }
    ],
    'MCA': [
  { id: '13001', name: 'Prof. Kanadam Karteeka Pavan', department: 'MCA', designation: 'Professor' },
  { id: '13002', name: 'Prof. Ch Suneetha', department: 'MCA', designation: 'Professor' },
  { id: '13003', name: 'Prof. Mandapati Sridhar', department: 'MCA', designation: 'Professor' },
  { id: '13004', name: 'Smt. Kalyani Rayapati', department: 'MCA', designation: 'Assistant Professor' },
  { id: '13005', name: 'Ms. Yeddla Anusha', department: 'MCA', designation: 'Assistant Professor' },
  { id: '13006', name: 'Ms. Sri Lakshmi Bhimineni', department: 'MCA', designation: 'Assistant Professor' },
  { id: '13007', name: 'Ms. Siva Parvathi Kalluri', department: 'MCA', designation: 'Assistant Professor' },
  { id: '13008', name: 'Ms. Sandhya Rani Sanka', department: 'MCA', designation: 'Assistant Professor' },
  { id: '13009', name: 'Mr. Ashok Kumar Mannava', department: 'MCA', designation: 'Assistant Professor' },
  { id: '13010', name: 'Mr. Narendra Narra', department: 'MCA', designation: 'Assistant Professor' },
  { id: '13011', name: 'Mr. Srikanth Yerram', department: 'MCA', designation: 'Assistant Professor' },
  { id: '13012', name: 'Mr. Anki Reddy Koduri', department: 'MCA', designation: 'Assistant Professor' },
  { id: '13013', name: 'Mrs. Gaddipati Mercy Rani', department: 'MCA', designation: 'Assistant Professor' },
  { id: '13014', name: 'Mrs. Lakshmi Ponnam', department: 'MCA', designation: 'Assistant Professor' },
  { id: '13015', name: 'Ms. Darsi Krishnakumari', department: 'MCA', designation: 'Assistant Professor' },
  { id: '13016', name: 'Mr. Narmada Muddana', department: 'MCA', designation: 'Assistant Professor' },
  { id: '13017', name: 'Mr. Ramakrishna Rao Namineni', department: 'MCA', designation: 'Assistant Professor' }
    ],
    'MBA': [
      { id: '14001', name: 'Charles Bennett', department: 'MBA', designation: 'Professor' },
      { id: '14002', name: 'Victoria Morris', department: 'MBA', designation: 'Associate Professor' },
      { id: '14003', name: 'Alexander Foster', department: 'MBA', designation: 'Assistant Professor' },
      { id: '14004', name: 'Elizabeth Howard', department: 'MBA', designation: 'Professor' },
      { id: '14005', name: 'Robert Patel', department: 'MBA', designation: 'Associate Professor' }
    ]
  };

  useEffect(() => {
    // Check authentication and get coordinator data
    const coordinatorData = localStorage.getItem('coordinatorData');
    if (!coordinatorData) {
      navigate('/coordinator', { replace: true });
      return;
    }
    
    const data = JSON.parse(coordinatorData);
    if (!data.isAuthenticated || !data.branch) {
      navigate('/coordinator', { replace: true });
      return;
    }
    
    setUserData(data);
    
    // Load branch-specific employees
    const branchData = departmentEmployees[data.branch] || [];
    setBranchEmployees(branchData);
    
    // Set today's date as default
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setSelectedDate(formattedDate);
    setTodayDate(formattedDate);
    
    // Check if there are already saved employees for this branch
    const savedData = localStorage.getItem(`employees_${data.branch}`);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (Array.isArray(parsed)) {
          setSelectedEmployees(parsed);
        }
      } catch (error) {
        console.error('Error parsing saved employee data:', error);
      }
    }
  }, [navigate]);

  // Filter displayed employees to only show today and future dates
  useEffect(() => {
    if (selectedEmployees.length > 0 && todayDate) {
      const filteredEmployees = selectedEmployees.filter(emp => {
        return emp.date >= todayDate;
      });
      setDisplayedEmployees(filteredEmployees);
    } else {
      setDisplayedEmployees([]);
    }
  }, [selectedEmployees, todayDate]);

  const handleAddEmployee = () => {
    if (!selectedEmployee || !selectedDate) {
      alert('Please select an employee and date');
      return;
    }
    
    // Don't allow adding employees for past dates
    if (selectedDate < todayDate) {
      alert('Cannot add employees for past dates');
      return;
    }
    
    const employee = branchEmployees.find(emp => emp.id === selectedEmployee);
    
    if (!employee) {
      alert('Please select a valid employee');
      return;
    }
    
    // Check if employee is already selected for this date and session
    const alreadyAdded = selectedEmployees.some(
      emp => emp.id === employee.id && emp.date === selectedDate && emp.session === selectedSession
    );
    
    if (alreadyAdded) {
      alert(`This employee is already added for the selected date (${selectedSession})`);
      return;
    }
    
    const newSelection = {
      ...employee,
      date: selectedDate,
      session: selectedSession
    };
    
    setSelectedEmployees(prev => [...prev, newSelection]);
    setSelectedEmployee('');
  };

  const handleRemoveEmployee = (index) => {
    const employeeToRemove = displayedEmployees[index];
    
    // Remove from both displayed employees (for UI) and selectedEmployees (for data storage)
    setSelectedEmployees(prev => prev.filter(emp => 
      !(emp.id === employeeToRemove.id && emp.date === employeeToRemove.date && emp.session === employeeToRemove.session)
    ));
  };

  const handleExport = () => {
    if (selectedEmployees.length === 0) {
      alert('No employees selected yet');
      return;
    }

    const headers = ['ID', 'Name', 'Department', 'Designation', 'Date', 'Session'];
    const csvContent = [
      headers.join(','),
      ...selectedEmployees.map(emp => 
        [emp.id, emp.name, emp.department, emp.designation, emp.date, emp.session].join(',')
      )
    ].join('\n');

    // Save to localStorage with branch-specific key
    localStorage.setItem(`employees_${userData.branch}`, JSON.stringify(selectedEmployees));
    localStorage.setItem(`employeesCSV_${userData.branch}`, csvContent);
    
    alert('Employee list saved successfully!');
  };

  // Filter employees based on search term
  const filteredEmployees = branchEmployees.filter(
    emp => 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to validate if a date is in the future or today
  const isDateValid = (date) => {
    return date >= todayDate;
  };

  return (
    <div className="available-employees-container">
      <div className="employees-card">
        <div className="employees-header">
          <h2 className="header-title">
            Available Employees - {userData?.branch || ''}
          </h2>
          <button className="back-button" onClick={() => navigate('/cord')}>
            <FaArrowLeft /> Back to Dashboard
          </button>
        </div>

        <div className="input-section">
          <div className="date-selection-row">
            <div className="selection-wrapper">
              <div className="date-picker">
                <label className="input-label">
                  <FaCalendarAlt /> Select Date
                </label>
                <input
                  type="date"
                  className="date-input"
                  value={selectedDate}
                  min={todayDate} // Prevent selecting past dates
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
                {selectedDate < todayDate && (
                  <p className="date-warning">Cannot select dates in the past</p>
                )}
              </div>
              
              <div className="session-selector">
                <label className="input-label">
                  <FaClock /> Select Session
                </label>
                <div className="session-buttons">
                  <button
                    type="button"
                    className={`session-btn ${selectedSession === 'AM' ? 'active' : ''}`}
                    onClick={() => setSelectedSession('AM')}
                  >
                    AM
                  </button>
                  <button
                    type="button"
                    className={`session-btn ${selectedSession === 'PM' ? 'active' : ''}`}
                    onClick={() => setSelectedSession('PM')}
                  >
                    PM
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="search-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, ID or designation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="employee-selection">
            <label className="input-label">Select Employee</label>
            <select
              className="employee-dropdown"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <option value="">-- Select an Employee --</option>
              {filteredEmployees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.id} - {emp.name} ({emp.designation})
                </option>
              ))}
            </select>
          </div>
          
          <button 
            className={`add-button ${!isDateValid(selectedDate) ? 'disabled' : ''}`}
            onClick={handleAddEmployee}
            disabled={!isDateValid(selectedDate)}
          >
            <FaUserPlus /> Add Employee for {selectedDate} ({selectedSession})
          </button>
        </div>

        <div className="table-section">
          <h3 className="table-title">
            Selected Employees (Today & Future Dates Only)
            <span className="date-indicator">Current Date: {todayDate}</span>
          </h3>
          <table className="employees-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Date</th>
                <th>Session</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {displayedEmployees.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-table-message">
                    No employees selected for today or future dates yet. Please select employees from the dropdown.
                  </td>
                </tr>
              ) : (
                displayedEmployees.map((emp, index) => (
                  <tr key={index} className={emp.date === todayDate ? 'today-row' : ''}>
                    <td>{emp.id}</td>
                    <td>{emp.name}</td>
                    <td>{emp.department}</td>
                    <td>{emp.designation}</td>
                    <td>
                      <span className="date-value">{emp.date}</span>
                      {emp.date === todayDate && <span className="today-badge">Today</span>}
                    </td>
                    <td>
                      <span className={`session-badge ${emp.session}`}>{emp.session}</span>
                    </td>
                    <td>
                      <button 
                        className="remove-button"
                        onClick={() => handleRemoveEmployee(index)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {selectedEmployees.length > 0 && (
          <div className="save-section">
            <div className="employees-count">
              <span className="count-badge">{displayedEmployees.length}</span> of {selectedEmployees.length} employees shown (past dates hidden)
            </div>
            <button className="save-button" onClick={handleExport}>
              <FaSave /> Save Employee List
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableEmployees;