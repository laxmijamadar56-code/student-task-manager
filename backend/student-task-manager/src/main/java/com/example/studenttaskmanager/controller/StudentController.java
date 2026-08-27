package com.example.studenttaskmanager.controller;

import com.example.studenttaskmanager.entity.Student;
import com.example.studenttaskmanager.service.StudentService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/students")
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // GET /students
    @GetMapping
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    // GET /students/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(
            @PathVariable Long id) {

        return studentService.getStudentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /students
    @PostMapping
    public Student addStudent(
            @RequestBody Student student) {

        return studentService.saveStudent(student);
    }

    // POST /students/login
    @PostMapping("/login")
    public ResponseEntity<Student> login(
            @RequestBody Student student) {

        return studentService
                .login(
                        student.getEmail(),
                        student.getPassword()
                )
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(401).build());
    }

    // DELETE /students/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(
            @PathVariable Long id) {

        if (studentService.getStudentById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        studentService.deleteStudent(id);

        return ResponseEntity.noContent().build();
    }
}
