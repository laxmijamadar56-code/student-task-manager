package com.example.studenttaskmanager.service;

import com.example.studenttaskmanager.entity.Student;
import com.example.studenttaskmanager.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // Register / Save Student
    public Student saveStudent(Student student) {

        System.out.println(">>> SAVE STUDENT CALLED");
        System.out.println(">>> Name: " + student.getName());
        System.out.println(">>> Email: " + student.getEmail());

        try {
            Student saved = studentRepository.save(student);

            System.out.println(">>> STUDENT SAVED: " + saved.getId());

            return saved;

        } catch (Exception e) {

            System.out.println(">>> DATABASE ERROR:");
            e.printStackTrace();

            throw e;
        }
    }

    // Get all students
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // Get student by ID
    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }

    // Delete student
    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

    // Login
    public Optional<Student> login(String email, String password) {

        System.out.println("===== LOGIN DEBUG =====");

        System.out.println("EMAIL RECEIVED: [" + email + "]");

        System.out.println("PASSWORD LENGTH: "
                + (password == null ? "null" : password.length()));

        Optional<Student> student =
                studentRepository.findByEmail(email);

        System.out.println("STUDENT FOUND: " + student.isPresent());

        if (student.isPresent()) {

            String dbPassword = student.get().getPassword();

            System.out.println("DB PASSWORD LENGTH: "
                    + (dbPassword == null ? "null" : dbPassword.length()));

            boolean match =
                    password != null
                    && dbPassword != null
                    && password.equals(dbPassword);

            System.out.println("PASSWORD MATCH: " + match);

            if (match) {
                return student;
            }
        }

        System.out.println("=======================");

        return Optional.empty();
    }
}
