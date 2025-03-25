import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaSave, FaArrowLeft, FaCalendarAlt } from 'react-icons/fa';
import './Availableemployees.css';

const AvailableEmployees = () => {
  const navigate = useNavigate();
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [branchEmployees, setBranchEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [userData, setUserData] = useState(null);

  // Department-specific employee data
  const departmentEmployees = {
    'CSE': [
      { id: 'CSE001', name: 'Dr. Sreelatha Malempati', department: 'CSE', designation: 'Professor & HoD' },
      { id: 'CSE002', name: 'Dr. Chaparala Aparna', department: 'CSE', designation: 'Professor' },
      { id: 'CSE003', name: 'Dr. R. Lakshmi Tulasi', department: 'CSE', designation: 'Professor' },
      { id: 'CSE004', name: 'Dr. Boyapati Varaprasad Rao', department: 'CSE', designation: 'Professor' },
      { id: 'CSE005', name: 'Dr. Meda Srikanth', department: 'CSE', designation: 'Professor' },
      { id: 'CSE006', name: 'Sri. Chekka Ratna Babu', department: 'CSE', designation: 'Associate Professor' },
      { id: 'CSE007', name: 'Dr. K. Siva Kumar', department: 'CSE', designation: 'Associate Professor' },
      { id: 'CSE008', name: 'Dr. S J R K Padminivalli V', department: 'CSE', designation: 'Associate Professor' },
      { id: 'CSE009', name: 'Sri. Eluri Ramesh', department: 'CSE', designation: 'Assistant Professor' },
      { id: 'CSE010', name: 'Smt. Mandadi Vasavi', department: 'CSE', designation: 'Assistant Professor' },
      { id: 'CSE011', name: 'Mr. Mabubashar', department: 'CSE', designation: 'Assistant Professor' },
      { id: 'CSE012', name: 'Sri. Pulicherla Siva Prasad', department: 'CSE', designation: 'Assistant Professor' },
      { id: 'CSE013', name: 'Sri. Madamanchi Brahmaiah', department: 'CSE', designation: 'Assistant Professor' },
      { id: 'CSE014', name: 'Smt. Challa Vijaya Madhavi Lakshmi', department: 'CSE', designation: 'Assistant Professor' },
      { id: 'CSE015', name: 'Dr. Zarapala Sunitha Bai', department: 'CSE', designation: 'Assistant Professor' },
      { id: 'CSE016', name: 'Smt. Bezawada Manasa', department: 'CSE', designation: 'Assistant Professor' },
      { id: 'CSE017', name: 'Sri. Paladugu Rama Krishna', department: 'CSE', designation: 'Assistant Professor' },
      { id: 'CSE018', name: 'Smt. Zareena Noorbasha', department: 'CSE', designation: 'Assistant Professor' },
      { id: 'CSE019', name: 'Ms. Cherukuri Vijaya Lakshmi', department: 'CSE', designation: 'Assistant Professor' },
      { id: 'CSE020', name: 'Ms. Paruchuri Anuradha', department: 'CSE', designation: 'Assistant Professor' },
      { id: 'CSE021', name: 'Sri. Sajja Karthik', department: 'CSE', designation: 'Assistant Professor' },
      { id: 'CSE022', name: 'Ms. Indlamuri Bhargavi', department: 'CSE', designation: 'Assistant Professor' },
      { id: 'CSE023', name: 'Ms. Gunturi Sriteja', department: 'CSE', designation: 'Assistant Professor' },
      { id: 'CSE024', name: 'Ms. Gorijala Gowthami', department: 'CSE', designation: 'Assistant Professor' },
      { id: 'CSE025', name: 'Ms. Shaik Jannathul Fridosh', department: 'CSE', designation: 'Assistant Professor' },
      { id: 'CSE026', name: 'Ms. Shaik Rajiya', department: 'CSE', designation: 'Assistant Professor' },
      { id: 'CSE027', name: 'Mr. Veravalli Chakravarthi', department: 'CSE', designation: 'Assistant Professor' },
      { id: 'CSE028', name: 'Mr. Satuluri Manoj Kumar', department: 'CSE', designation: 'Assistant Professor' },
      { id: 'CSE029', name: 'Smt. Chanamala Sukognya', department: 'CSE', designation: 'Assistant Professor' },
      { id: 'CSE030', name: 'Smt. Gaddam Mounika', department: 'CSE', designation: 'Assistant Professor' },
      { id: 'CSE031', name: 'Mrs. Medikonduru Maithili Saisree', department: 'CSE', designation: 'Assistant Professor' },
      { id: 'CSE032', name: 'Mr. Nimmagadda Chandra Sekhar', department: 'CSE', designation: 'Assistant Professor' },
      { id: 'CSE033', name: 'Smt. Alekhya Kancharla', department: 'CSE', designation: 'Assistant Professor' },
      { id: 'CSE034', name: 'Dr. Bhagya Lakshmi Nandipati', department: 'CSE', designation: 'Assistant Professor' },
      { id: 'CSE035', name: 'Smt. Jyothi Kameswari U', department: 'CSE', designation: 'Assistant Professor' },
      { id: 'CSE036', name: 'Smt. Dhanekula Tejaswini', department: 'CSE', designation: 'Assistant Professor' },
      { id: 'CSE037', name: 'Mr. Manne Rajesh', department: 'CSE', designation: 'Assistant Professor' }


    ],
    'CSBS': [
      { id: 'CSBS001', name: 'Dr. Ayyagari Srinagesh', department: 'CSBS', designation: 'Professor & HoD' },
      { id: 'CSBS002', name: 'Dr. T. Anuradha', department: 'CSBS', designation: 'Associate Professor' },
      { id: 'CSBS003', name: 'Dr. Lakshmikanth Paleti', department: 'CSBS', designation: 'Associate Professor' },
      { id: 'CSBS004', name: 'Dr. Srinivasa Rao Mandalapu', department: 'CSBS', designation: 'Assistant Professor' },
      { id: 'CSBS005', name: 'Mrs. D. Deepthi', department: 'CSBS', designation: 'Assistant Professor' },
      { id: 'CSBS006', name: 'Mrs. Jagarlamudi Amala', department: 'CSBS', designation: 'Assistant Professor' },
      { id: 'CSBS007', name: 'Mrs. Nalluri Bhargavi', department: 'CSBS', designation: 'Assistant Professor' },
      { id: 'CSBS008', name: 'Mrs. Annavarapu Mahalakshmi', department: 'CSBS', designation: 'Assistant Professor' }
    ],
    'CSE(DS)': [
      { id: 'CSEDS001', name: 'Dr. M.V.P. Chandra Sekhara Rao', department: 'CSE(DS)', designation: 'Professor & HOD' },
      { id: 'CSEDS002', name: 'Dr. Sudha Sree Chekuri', department: 'CSE(DS)', designation: 'Associate Professor' },
      { id: 'CSEDS003', name: 'Dr. Ganji Ramanjaiah', department: 'CSE(DS)', designation: 'Associate Professor' },
      { id: 'CSEDS004', name: 'Dr. Popuri Srinivasa Rao', department: 'CSE(DS)', designation: 'Associate Professor' },
      { id: 'CSEDS005', name: 'Dr. Riaz Shaik', department: 'CSE(DS)', designation: 'Associate Professor' },
      { id: 'CSEDS006', name: 'Mr. Peddi Anudeep', department: 'CSE(DS)', designation: 'Assistant Professor' },
      { id: 'CSEDS007', name: 'Mr. Subramanyam Kunisetty', department: 'CSE(DS)', designation: 'Assistant Professor' },
      { id: 'CSEDS008', name: 'Mrs. Aravinda Kasukurthi', department: 'CSE(DS)', designation: 'Assistant Professor' },
      { id: 'CSEDS009', name: 'Mr. Ramakrishna Badiguntla', department: 'CSE(DS)', designation: 'Assistant Professor' },
      { id: 'CSEDS010', name: 'Mr. Rallabandi Ch S N P Sairam', department: 'CSE(DS)', designation: 'Assistant Professor' },
      { id: 'CSEDS011', name: 'Mr. A V Krishnarao Padyala', department: 'CSE(DS)', designation: 'Assistant Professor' },
      { id: 'CSEDS012', name: 'Mrs. Swathi Nelavalli', department: 'CSE(DS)', designation: 'Assistant Professor' },
      { id: 'CSEDS013', name: 'Mrs. Padmaja Inturi', department: 'CSE(DS)', designation: 'Assistant Professor' },
      { id: 'CSEDS014', name: 'Ms. Annam Manjusha', department: 'CSE(DS)', designation: 'Assistant Professor' },
      { id: 'CSEDS015', name: 'Mr. Palukuri Punnarao', department: 'CSE(DS)', designation: 'Assistant Professor' }
    ],
    'CSE(AI&ML)': [
      { id: 'CSEAI001', name: 'Prof. Gatram Rama Mohan Babu', department: 'CSE(AI&ML)', designation: 'Professor & Head' },
      { id: 'CSEAI002', name: 'Prof. N. Venkateswara Rao', department: 'CSE(AI&ML)', designation: 'Professor' },
      { id: 'CSEAI003', name: 'Dr. Palacharla Ravikumar', department: 'CSE(AI&ML)', designation: 'Associate Professor' },
      { id: 'CSEAI004', name: 'Mr. Annapureddy Rama Prathap Reddy', department: 'CSE(AI&ML)', designation: 'Assistant Professor' },
      { id: 'CSEAI005', name: 'Smt. Venkata Anusha Kolluru', department: 'CSE(AI&ML)', designation: 'Assistant Professor' },
      { id: 'CSEAI006', name: 'Sri. Narne Srikanth', department: 'CSE(AI&ML)', designation: 'Assistant Professor' },
      { id: 'CSEAI007', name: 'Sri. Onteru Srinivas', department: 'CSE(AI&ML)', designation: 'Assistant Professor' },
      { id: 'CSEAI008', name: 'Mr. Reddy Veeramohanrao', department: 'CSE(AI&ML)', designation: 'Assistant Professor' },
      { id: 'CSEAI009', name: 'Mrs. Dandamudi Srilatha', department: 'CSE(AI&ML)', designation: 'Assistant Professor' },
      { id: 'CSEAI010', name: 'Mrs. K. Bhagya Lalitha', department: 'CSE(AI&ML)', designation: 'Assistant Professor' },
      { id: 'CSEAI011', name: 'Sri. Mannava Vijaya Bhaskar', department: 'CSE(AI&ML)', designation: 'Assistant Professor' }
    ],
    'CSE(IOT)': [
      { id: 'CSEIOT001', name: 'Prof. Nallamothu Nagamalleswara Rao', department: 'CSE(IOT)', designation: 'Professor & Head' },
      { id: 'CSEIOT002', name: 'Dr. Nageswara Rao Eluri', department: 'CSE(IOT)', designation: 'Associate Professor' },
      { id: 'CSEIOT003', name: 'Mr. Burla Nagaraju', department: 'CSE(IOT)', designation: 'Assistant Professor' },
      { id: 'CSEIOT004', name: 'Mr. Psam Prudhvi Kiran', department: 'CSE(IOT)', designation: 'Assistant Professor' }
    ],
    'IT': [
      { id: 'IT001', name: 'Dr. Atuluri Sri Krishna', department: 'IT', designation: 'Professor & HOD' },
      { id: 'IT002', name: 'Dr. B Hemanth Kumar', department: 'IT', designation: 'Professor' },
      { id: 'IT003', name: 'Sri G. Srinivasa Rao', department: 'IT', designation: 'Associate Professor' },
      { id: 'IT004', name: 'Dr. M. Pompapathi', department: 'IT', designation: 'Associate Professor' },
      { id: 'IT005', name: 'Dr. V. Sesha Srinivas', department: 'IT', designation: 'Associate Professor' },
      { id: 'IT006', name: 'Dr. Yaswanth Kumar Alapati', department: 'IT', designation: 'Associate Professor' },
      { id: 'IT007', name: 'Dr. Bh Krishna Mohan', department: 'IT', designation: 'Associate Professor' },
      { id: 'IT008', name: 'Dr. Gadde Swetha', department: 'IT', designation: 'Associate Professor' },
      { id: 'IT009', name: 'Sri B. Venkateswarlu', department: 'IT', designation: 'Associate Professor' },
      { id: 'IT010', name: 'Sri Madamanchi Venkata Bhujanga Rao', department: 'IT', designation: 'Assistant Professor' },
      { id: 'IT011', name: 'Dr. N. Neelima', department: 'IT', designation: 'Assistant Professor' },
      { id: 'IT012', name: 'Smt. I. Naga Padmaja', department: 'IT', designation: 'Assistant Professor' },
      { id: 'IT013', name: 'Smt. B. Manasa', department: 'IT', designation: 'Assistant Professor' },
      { id: 'IT014', name: 'Sri Venkata Srinivasu Veesam', department: 'IT', designation: 'Assistant Professor' },
      { id: 'IT015', name: 'Sri Bandaru Satish Babu', department: 'IT', designation: 'Assistant Professor' },
      { id: 'IT016', name: 'Smt. N. Lakshmi Haritha', department: 'IT', designation: 'Assistant Professor' },
      { id: 'IT017', name: 'Smt. D. Swathi', department: 'IT', designation: 'Assistant Professor' },
      { id: 'IT018', name: 'Smt. D. Swapna', department: 'IT', designation: 'Assistant Professor' },
      { id: 'IT019', name: 'Smt. D. Surekha', department: 'IT', designation: 'Assistant Professor' },
      { id: 'IT020', name: 'Smt. K. Navya', department: 'IT', designation: 'Assistant Professor' },
      { id: 'IT021', name: 'Smt. N. Gayatri Saranya', department: 'IT', designation: 'Assistant Professor' },
      { id: 'IT022', name: 'Sri A. Sambasiva Rao', department: 'IT', designation: 'Assistant Professor' },
      { id: 'IT023', name: 'Smt. Kotha Chandana', department: 'IT', designation: 'Assistant Professor' },
      { id: 'IT024', name: 'Smt. Y. Meena', department: 'IT', designation: 'Assistant Professor' },
      { id: 'IT025', name: 'Sri. J. Madhan Kumar', department: 'IT', designation: 'Assistant Professor' }
    ],
    'ECE': [
      { id: 'ECE001', name: 'Dr. T. Ranga Babu', department: 'ECE', designation: 'Professor & Head' },
      { id: 'ECE002', name: 'Dr. M.V. Siva Prasad', department: 'ECE', designation: 'Professor' },
      { id: 'ECE003', name: 'Dr. G. Sudhavani', department: 'ECE', designation: 'Professor' },
      { id: 'ECE004', name: 'Dr. J. Ravindranadh', department: 'ECE', designation: 'Professor' },
      { id: 'ECE005', name: 'Dr. M. Satya Sai Ram', department: 'ECE', designation: 'Professor' },
      { id: 'ECE006', name: 'Dr. N. Renuka', department: 'ECE', designation: 'Professor' },
      { id: 'ECE007', name: 'Dr. P.P.S. Subhashini', department: 'ECE', designation: 'Professor' },
      { id: 'ECE008', name: 'Dr. P. Suresh Kumar', department: 'ECE', designation: 'Associate Professor' },
      { id: 'ECE009', name: 'Dr. D. Eswara Chaitanya', department: 'ECE', designation: 'Associate Professor' },
      { id: 'ECE010', name: 'Dr. X. Ascar Davix', department: 'ECE', designation: 'Associate Professor' },
      { id: 'ECE011', name: 'Dr. K. Upendra Chowdary', department: 'ECE', designation: 'Associate Professor' },
      { id: 'ECE012', name: 'Dr. S. Ramesh Babu', department: 'ECE', designation: 'Associate Professor' },
      { id: 'ECE013', name: 'Dr. P. Siva Prasad', department: 'ECE', designation: 'Associate Professor' },
      { id: 'ECE014', name: 'Dr. K. Sravanthi', department: 'ECE', designation: 'Associate Professor' },
      { id: 'ECE015', name: 'Dr. T. Suneetha', department: 'ECE', designation: 'Associate Professor' },
      { id: 'ECE017', name: 'Mr. A. Murali Krishna', department: 'ECE', designation: 'Assistant Professor' },
      { id: 'ECE018', name: 'Smt. M. Sunitha', department: 'ECE', designation: 'Assistant Professor' },
      { id: 'ECE019', name: 'Sri. P.V. Krishna Kanth', department: 'ECE', designation: 'Assistant Professor' },
      { id: 'ECE020', name: 'Mr. K. Anil Kumar', department: 'ECE', designation: 'Assistant Professor' },
      { id: 'ECE021', name: 'Mr. K. Ashok Kumar', department: 'ECE', designation: 'Assistant Professor' },
      { id: 'ECE022', name: 'Dr. D. Jagadeesh', department: 'ECE', designation: 'Assistant Professor' },
      { id: 'ECE023', name: 'Mr. N. Pavan Kumar', department: 'ECE', designation: 'Assistant Professor' },
      { id: 'ECE024', name: 'Dr. N. Sudheer Kumar', department: 'ECE', designation: 'Assistant Professor' },
      { id: 'ECE025', name: 'Mr. K. Sudhakar', department: 'ECE', designation: 'Assistant Professor' },
      { id: 'ECE026', name: 'Mr. Ch. Jayaram', department: 'ECE', designation: 'Assistant Professor' },
      { id: 'ECE027', name: 'Smt. Makkapati Himaja', department: 'ECE', designation: 'Assistant Professor' },
      { id: 'ECE028', name: 'Smt. Koritala Nagavardhani', department: 'ECE', designation: 'Assistant Professor' },
      { id: 'ECE029', name: 'Smt. P. Bala Prasanthi', department: 'ECE', designation: 'Assistant Professor' },
      { id: 'ECE030', name: 'Mr. B. Sriram', department: 'ECE', designation: 'Assistant Professor' },
      { id: 'ECE031', name: 'Mr. M. Jaya Prakash', department: 'ECE', designation: 'Assistant Professor' },
      { id: 'ECE032', name: 'Smt. Y. Naveena', department: 'ECE', designation: 'Assistant Professor' },
      { id: 'ECE033', name: 'Mr. V. Prakash', department: 'ECE', designation: 'Assistant Professor' },
      { id: 'ECE034', name: 'Smt. V. Anusha', department: 'ECE', designation: 'Assistant Professor' },
      { id: 'ECE035', name: 'Smt. Pudota Bindu Sri', department: 'ECE', designation: 'Assistant Professor' },
      { id: 'ECE036', name: 'Smt. Nuthalapati Hemalatha', department: 'ECE', designation: 'Assistant Professor' },
      { id: 'ECE037', name: 'Ms. Pasam Pavithra', department: 'ECE', designation: 'Assistant Professor' },
      { id: 'ECE038', name: 'Sri. D. Pushpa Rao', department: 'ECE', designation: 'Assistant Professor' },
      { id: 'ECE039', name: 'Ms. T. Pavani', department: 'ECE', designation: 'Assistant Professor' },
      { id: 'ECE040', name: 'Dr. P. Sai Vinay Kumar', department: 'ECE', designation: 'Assistant Professor' }
    ],
    'EEE': [
      { id: 'EEE001', name: 'Dr. Koritala Chandra Sekhar', department: 'EEE', designation: 'Professor & HOD' },
      { id: 'EEE002', name: 'Dr. Katragadda Swarnasri', department: 'EEE', designation: 'Professor' },
      { id: 'EEE003', name: 'Dr. Korrapati Radha Rani', department: 'EEE', designation: 'Professor' },
      { id: 'EEE004', name: 'Dr. G. Sambasiva Rao', department: 'EEE', designation: 'Professor' },
      { id: 'EEE005', name: 'Dr. N.C. Kotaiah', department: 'EEE', designation: 'Professor' },
      { id: 'EEE006', name: 'Dr. Ramakoteswararao Alla', department: 'EEE', designation: 'Associate Professor' },
      { id: 'EEE007', name: 'Dr. N. Chaitanya', department: 'EEE', designation: 'Associate Professor' },
      { id: 'EEE008', name: 'Dr. Y. Ravindranath Tagore', department: 'EEE', designation: 'Associate Professor' },
      { id: 'EEE009', name: 'Dr. G.V. Prasanna Anjaneyulu', department: 'EEE', designation: 'Associate Professor' },
      { id: 'EEE010', name: 'Dr. Mallipeddi Anitha', department: 'EEE', designation: 'Associate Professor' },
      { id: 'EEE011', name: 'Dr. Ponnam Venkata Kishore Babu', department: 'EEE', designation: 'Associate Professor' },
      { id: 'EEE012', name: 'Dr. Tripura Pidikiti', department: 'EEE', designation: 'Associate Professor' },
      { id: 'EEE013', name: 'Dr. Ch. Ranga Rao', department: 'EEE', designation: 'Associate Professor' },
      { id: 'EEE014', name: 'Dr. Dharani Kumar Narne', department: 'EEE', designation: 'Associate Professor' },
      { id: 'EEE015', name: 'Dr. Sumanth Yamparala', department: 'EEE', designation: 'Associate Professor' },
      { id: 'EEE016', name: 'Dr. Sarayu Vunnam', department: 'EEE', designation: 'Assistant Professor' },
      { id: 'EEE017', name: 'Mr. B. Sarath Chandra', department: 'EEE', designation: 'Assistant Professor' },
      { id: 'EEE018', name: 'Mr. Veeranjaneyulu Gopu', department: 'EEE', designation: 'Assistant Professor' },
      { id: 'EEE019', name: 'Dr. P. Venkata Mahesh', department: 'EEE', designation: 'Assistant Professor' },
      { id: 'EEE020', name: 'Mr. Rayaprolu Mallikharjuna Raghuveer', department: 'EEE', designation: 'Assistant Professor' },
      { id: 'EEE021', name: 'Mrs. Tr Chandni', department: 'EEE', designation: 'Assistant Professor' },
      { id: 'EEE022', name: 'Mrs. Velaga Sree Vidya', department: 'EEE', designation: 'Assistant Professor' },
      { id: 'EEE023', name: 'Mrs. Ginjupalli Renuka', department: 'EEE', designation: 'Assistant Professor' },
      { id: 'EEE024', name: 'Mrs. Tubati Udayakrishna', department: 'EEE', designation: 'Assistant Professor' },
      { id: 'EEE025', name: 'Ms. Thota Siva Hemalatha', department: 'EEE', designation: 'Assistant Professor' },
      { id: 'EEE026', name: 'Mr. Kalluri Raviteja', department: 'EEE', designation: 'Assistant Professor' },
      { id: 'EEE027', name: 'Ms. Naganjani Kandula', department: 'EEE', designation: 'Assistant Professor' },
      { id: 'EEE028', name: 'Ms. Yadavalli Sushma', department: 'EEE', designation: 'Assistant Professor' },
      { id: 'EEE029', name: 'Ms. V Bhavyashree', department: 'EEE', designation: 'Assistant Professor' },
      { id: 'EEE030', name: 'Ms. D. Malathi', department: 'EEE', designation: 'Assistant Professor' },
      { id: 'EEE031', name: 'Ms. Bhavana Deviraddy', department: 'EEE', designation: 'Assistant Professor' },
      { id: 'EEE032', name: 'Ms. Sirisha Annam', department: 'EEE', designation: 'Assistant Professor' }
    ],
    'CIVIL': [
      { id: 'CIVIL001', name: 'Dr. K.S. Sai Ram', department: 'CIVIL', designation: 'Professor' },
      { id: 'CIVIL002', name: 'Dr. A. Srinivasa Prasad', department: 'CIVIL', designation: 'Professor & Head' },
      { id: 'CIVIL003', name: 'Sri. P.V.S. Maruthi Krishna', department: 'CIVIL', designation: 'Associate Professor' },
      { id: 'CIVIL004', name: 'Sri. Ramineni Surendra Babu', department: 'CIVIL', designation: 'Associate Professor' },
      { id: 'CIVIL005', name: 'Dr. R. Chandra Mohan', department: 'CIVIL', designation: 'Associate Professor' },
      { id: 'CIVIL006', name: 'Dr. J. Usha Kranti', department: 'CIVIL', designation: 'Associate Professor' },
      { id: 'CIVIL007', name: 'Dr. Ponduri Samatha Chowdary', department: 'CIVIL', designation: 'Associate Professor' },
      { id: 'CIVIL008', name: 'Dr. K. Leela Krishna', department: 'CIVIL', designation: 'Associate Professor' },
      { id: 'CIVIL009', name: 'Dr. L.N.K. Sai Madupu', department: 'CIVIL', designation: 'Associate Professor' },
      { id: 'CIVIL010', name: 'Dr. B. Kesava Rao', department: 'CIVIL', designation: 'Associate Professor' },
      { id: 'CIVIL011', name: 'Dr. N. Venkata Sairam Kumar', department: 'CIVIL', designation: 'Associate Professor' },
      { id: 'CIVIL012', name: 'Sri. M Srikanth Kumar', department: 'CIVIL', designation: 'Assistant Professor' },
      { id: 'CIVIL013', name: 'Sri. S.V. Satyanarayana', department: 'CIVIL', designation: 'Assistant Professor' },
      { id: 'CIVIL014', name: 'Ms. Y. Madhavi', department: 'CIVIL', designation: 'Assistant Professor' },
      { id: 'CIVIL015', name: 'Smt. Nandipati Tejaswini', department: 'CIVIL', designation: 'Assistant Professor' },
      { id: 'CIVIL016', name: 'Sri. Rachamallu Vaishnava Kumar', department: 'CIVIL', designation: 'Assistant Professor' },
      { id: 'CIVIL017', name: 'Smt. Palepu Srilakshmi', department: 'CIVIL', designation: 'Assistant Professor' },
      { id: 'CIVIL018', name: 'Sri Gunnam Sanijya', department: 'CIVIL', designation: 'Assistant Professor' },
      { id: 'CIVIL019', name: 'Dr. Bypaneni Krishna Chaitanya', department: 'CIVIL', designation: 'Assistant Professor' },
      { id: 'CIVIL021', name: 'Sri. Yenigandla Naga Mahesh', department: 'CIVIL', designation: 'Assistant Professor' },
      { id: 'CIVIL022', name: 'Sri. B. Yellamanda Rao', department: 'CIVIL', designation: 'Assistant Professor' },
      { id: 'CIVIL023', name: 'Sri. B. Durga Prasad', department: 'CIVIL', designation: 'Assistant Professor' },
      { id: 'CIVIL024', name: 'Ms. A. Bhavana Chowdary', department: 'CIVIL', designation: 'Assistant Professor' },
      { id: 'CIVIL025', name: 'Mr. Sk. Deen Mohammad', department: 'CIVIL', designation: 'Assistant Professor' },
      { id: 'CIVIL026', name: 'Mr. Sk. Johny Ibrahim', department: 'CIVIL', designation: 'Assistant Professor' },
      { id: 'CIVIL027', name: 'Mr. A. Vinod Reddy', department: 'CIVIL', designation: 'Assistant Professor' },
      { id: 'CIVIL028', name: 'Smt. M. Prathyusha', department: 'CIVIL', designation: 'Assistant Professor' },
      { id: 'CIVIL029', name: 'Ms. J. Venkata Susanka', department: 'CIVIL', designation: 'Assistant Professor' },
      { id: 'CIVIL030', name: 'Mr. TDNVS Akhil Babu', department: 'CIVIL', designation: 'Assistant Professor' },
      { id: 'CIVIL031', name: 'Mr. J. Akhil', department: 'CIVIL', designation: 'Assistant Professor' }
    ],
    'MECH': [
      { id: 'MECH001', name: 'Dr. D.V.V. Krishna Prasad', department: 'MECH', designation: 'Professor and HOD' },
      { id: 'MECH002', name: 'Dr. V. Chittaranjan Das', department: 'MECH', designation: 'Professor' },
      { id: 'MECH003', name: 'Dr. G. Srinivasa Rao', department: 'MECH', designation: 'Professor' },
      { id: 'MECH004', name: 'Dr. C. Srinivas', department: 'MECH', designation: 'Professor' },
      { id: 'MECH005', name: 'Dr. B. Ramgopal Reddy', department: 'MECH', designation: 'Professor' },
      { id: 'MECH006', name: 'Dr. N.V.V.S. Sudheer', department: 'MECH', designation: 'Professor' },
      { id: 'MECH007', name: 'Dr. K. Bala Prasad', department: 'MECH', designation: 'Professor' },
      { id: 'MECH008', name: 'Dr. G. Chaitanya', department: 'MECH', designation: 'Associate Professor' },
      { id: 'MECH009', name: 'Dr. N. Govind', department: 'MECH', designation: 'Associate Professor' },
      { id: 'MECH010', name: 'Dr. K. Praveen Kumar', department: 'MECH', designation: 'Associate Professor' },
      { id: 'MECH011', name: 'Dr. Radhika Sajja', department: 'MECH', designation: 'Associate Professor' },
      { id: 'MECH012', name: 'Dr. V. Ramakoteswara Rao', department: 'MECH', designation: 'Associate Professor' },
      { id: 'MECH013', name: 'Dr. R. Sreenivasulu', department: 'MECH', designation: 'Associate Professor' },
      { id: 'MECH014', name: 'Dr. P. Suresh Kumar', department: 'MECH', designation: 'Associate Professor' },
      { id: 'MECH015', name: 'Dr. D. Swapna', department: 'MECH', designation: 'Associate Professor' },
      { id: 'MECH016', name: 'Mr. Patibandla Rakesh Chowdary', department: 'MECH', designation: 'Assistant Professor' },
      { id: 'MECH017', name: 'Mr. Muttineni V Nagarjuna', department: 'MECH', designation: 'Assistant Professor' },
      { id: 'MECH018', name: 'Dr. G. Kishore Chowdari', department: 'MECH', designation: 'Associate Professor' },
      { id: 'MECH019', name: 'Mr. Basheer Ahmed Shaik', department: 'MECH', designation: 'Assistant Professor' },
      { id: 'MECH020', name: 'Ms. P. Sravani', department: 'MECH', designation: 'Assistant Professor' },
      { id: 'MECH021', name: 'Mr. Sakhamuri Venkata Kishore', department: 'MECH', designation: 'Assistant Professor' },
      { id: 'MECH022', name: 'Mr. Venkata Pavan Kumar Akula', department: 'MECH', designation: 'Assistant Professor' },
      { id: 'MECH023', name: 'Mr. Natha Arun Kumar', department: 'MECH', designation: 'Assistant Professor' },
      { id: 'MECH024', name: 'Mr. Bobbili Praveen', department: 'MECH', designation: 'Assistant Professor' },
      { id: 'MECH025', name: 'Dr. Muddu Alaparthi', department: 'MECH', designation: 'Assistant Professor' }
    ],
    'Chemical': [
      { id: 'CHE001', name: 'Dr. K. Ramesh Chandra', department: 'Chemical', designation: 'Associate Professor & HOD i/c' },
  { id: 'CHE002', name: 'Dr. N V Satyanarayana Derangula', department: 'Chemical', designation: 'Associate Professor' },
  { id: 'CHE003', name: 'Dr. Rohinikumar Palavalasa', department: 'Chemical', designation: 'Associate Professor' },
  { id: 'CHE004', name: 'Dr. K. Sobha', department: 'Chemical', designation: 'Professor' },
  { id: 'CHE005', name: 'Smt. Lakshmi Jayanthi Juturi', department: 'Chemical', designation: 'Assistant Professor' },
  { id: 'CHE006', name: 'Sri Krosuri Siva Prasada Rao', department: 'Chemical', designation: 'Assistant Professor' },
  { id: 'CHE007', name: 'Dr. G Kavitha', department: 'Chemical', designation: 'Assistant Professor' },
  { id: 'CHE008', name: 'Dr. Kagita Srikanthbheemareddy', department: 'Chemical', designation: 'Assistant Professor' },
  { id: 'CHE009', name: 'Sri Yallamanda Koritipati', department: 'Chemical', designation: 'Assistant Professor' },
  { id: 'CHE010', name: 'Smt. Bhargavi Devi Manepalli', department: 'Chemical', designation: 'Assistant Professor' },
  { id: 'CHE011', name: 'Dr. Bhavani Yellankula', department: 'Chemical', designation: 'Assistant Professor' },
  { id: 'CHE012', name: 'Smt. Pendyala Aparna', department: 'Chemical', designation: 'Assistant Professor' },
  { id: 'CHE013', name: 'Smt. Aradhyula Srilakshmi Tirupatamma', department: 'Chemical', designation: 'Assistant Professor' },
  { id: 'CHE014', name: 'Smt. Shubhra Shakya', department: 'Chemical', designation: 'Assistant Professor' }
    ],
    'MCA': [
      { id: 'MCA001', name: 'Prof. Kanadam Karteeka Pavan', department: 'MCA', designation: 'Professor' },
  { id: 'MCA002', name: 'Prof. Ch Suneetha', department: 'MCA', designation: 'Professor' },
  { id: 'MCA003', name: 'Prof. Mandapati Sridhar', department: 'MCA', designation: 'Professor' },
  { id: 'MCA004', name: 'Smt. Kalyani Rayapati', department: 'MCA', designation: 'Assistant Professor' },
  { id: 'MCA005', name: 'Ms. Yeddla Anusha', department: 'MCA', designation: 'Assistant Professor' },
  { id: 'MCA006', name: 'Ms. Sri Lakshmi Bhimineni', department: 'MCA', designation: 'Assistant Professor' },
  { id: 'MCA007', name: 'Ms. Siva Parvathi Kalluri', department: 'MCA', designation: 'Assistant Professor' },
  { id: 'MCA008', name: 'Ms. Sandhya Rani Sanka', department: 'MCA', designation: 'Assistant Professor' },
  { id: 'MCA009', name: 'Mr. Ashok Kumar Mannava', department: 'MCA', designation: 'Assistant Professor' },
  { id: 'MCA010', name: 'Mr. Narendra Narra', department: 'MCA', designation: 'Assistant Professor' },
  { id: 'MCA011', name: 'Mr. Srikanth Yerram', department: 'MCA', designation: 'Assistant Professor' },
  { id: 'MCA012', name: 'Mr. Anki Reddy Koduri', department: 'MCA', designation: 'Assistant Professor' },
  { id: 'MCA013', name: 'Mrs. Gaddipati Mercy Rani', department: 'MCA', designation: 'Assistant Professor' },
  { id: 'MCA014', name: 'Mrs. Lakshmi Ponnam', department: 'MCA', designation: 'Assistant Professor' },
  { id: 'MCA015', name: 'Ms. Darsi Krishnakumari', department: 'MCA', designation: 'Assistant Professor' },
  { id: 'MCA016', name: 'Mr. Narmada Muddana', department: 'MCA', designation: 'Assistant Professor' },
  { id: 'MCA017', name: 'Mr. Ramakrishna Rao Namineni', department: 'MCA', designation: 'Assistant Professor' }
    ],
    'MBA': [
      { id: 'MBA001', name: 'Charles Bennett', department: 'MBA', designation: 'Professor' },
      { id: 'MBA002', name: 'Victoria Morris', department: 'MBA', designation: 'Associate Professor' },
      { id: 'MBA003', name: 'Alexander Foster', department: 'MBA', designation: 'Assistant Professor' },
      { id: 'MBA004', name: 'Elizabeth Howard', department: 'MBA', designation: 'Professor' },
      { id: 'MBA005', name: 'Robert Patel', department: 'MBA', designation: 'Associate Professor' }
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

  const handleAddEmployee = () => {
    if (!selectedEmployee || !selectedDate) {
      alert('Please select an employee and date');
      return;
    }
    
    const employee = branchEmployees.find(emp => emp.id === selectedEmployee);
    
    if (!employee) {
      alert('Please select a valid employee');
      return;
    }
    
    // Check if employee is already selected for this date
    const alreadyAdded = selectedEmployees.some(
      emp => emp.id === employee.id && emp.date === selectedDate
    );
    
    if (alreadyAdded) {
      alert('This employee is already added for the selected date');
      return;
    }
    
    const newSelection = {
      ...employee,
      date: selectedDate
    };
    
    setSelectedEmployees(prev => [...prev, newSelection]);
    setSelectedEmployee('');
  };

  const handleRemoveEmployee = (index) => {
    setSelectedEmployees(prev => prev.filter((_, i) => i !== index));
  };

  const handleExport = () => {
    if (selectedEmployees.length === 0) {
      alert('No employees selected yet');
      return;
    }

    const headers = ['ID', 'Name', 'Department', 'Designation', 'Date'];
    const csvContent = [
      headers.join(','),
      ...selectedEmployees.map(emp => 
        [emp.id, emp.name, emp.department, emp.designation, emp.date].join(',')
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
            <div className="date-picker">
              <label className="input-label">
                <FaCalendarAlt /> Select Date
              </label>
              <input
                type="date"
                className="date-input"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
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
          
          <button className="add-button" onClick={handleAddEmployee}>
            <FaUserPlus /> Add Employee for {selectedDate}
          </button>
        </div>

        <div className="table-section">
          <h3 className="table-title">Selected Employees</h3>
          <table className="employees-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {selectedEmployees.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-table-message">
                    No employees selected yet. Please select employees from the dropdown.
                  </td>
                </tr>
              ) : (
                selectedEmployees.map((emp, index) => (
                  <tr key={index}>
                    <td>{emp.id}</td>
                    <td>{emp.name}</td>
                    <td>{emp.department}</td>
                    <td>{emp.designation}</td>
                    <td>{emp.date}</td>
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