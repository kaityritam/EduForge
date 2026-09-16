from app.database import SessionLocal, engine, Base
from app.models import Course, CourseCategory, User, UserCourse, Roadmap, RoadmapDay

# Create all tables
Base.metadata.create_all(bind=engine)

def seed_categories():
    db = SessionLocal()
    
    # Check if categories already exist
    existing = db.query(CourseCategory).count()
    if existing > 0:
        print(f"Categories already exist ({existing} found). Skipping...")
        db.close()
        return
    
    categories = [
        {"name": "Programming Languages", "icon": "💻", "description": "Learn languages like Python, Java, C++"},
        {"name": "Data Structures & Algorithms", "icon": "📊", "description": "Master DSA for coding interviews"},
        {"name": "Machine Learning & AI", "icon": "🤖", "description": "Learn ML, Deep Learning, NLP"},
        {"name": "Web Development", "icon": "🌐", "description": "Build websites and web apps"},
        {"name": "Database Systems", "icon": "🗄️", "description": "Learn SQL, NoSQL, DB Design"},
        {"name": "DevOps & Cloud", "icon": "☁️", "description": "Learn Docker, Kubernetes, AWS"},
        {"name": "App Development", "icon": "📱", "description": "Android, iOS, Cross-platform"},
        {"name": "Cybersecurity", "icon": "🔒", "description": "Network security, Ethical hacking"},
    ]
    
    for cat_data in categories:
        category = CourseCategory(**cat_data)
        db.add(category)
    
    db.commit()
    print(f"✅ Seeded {len(categories)} categories")
    db.close()


def seed_courses():
    db = SessionLocal()
    
    # Check if courses already exist
    existing = db.query(Course).count()
    if existing > 0:
        print(f"Courses already exist ({existing} found). Skipping...")
        db.close()
        return
    
    courses = [
        # Data Structures & Algorithms (category_id=2)
        {"category_id": 2, "name": "DSA in C++", "description": "Complete DSA course in C++ from basics to advanced", "difficulty": "Beginner", "duration_hours": 40},
        {"category_id": 2, "name": "DSA in Python", "description": "Complete DSA course in Python with practical examples", "difficulty": "Beginner", "duration_hours": 35},
        {"category_id": 2, "name": "Advanced DSA", "description": "Advanced algorithms and data structures for interviews", "difficulty": "Advanced", "duration_hours": 50},
        
        # Programming Languages (category_id=1)
        {"category_id": 1, "name": "Python Programming", "description": "Learn Python from scratch with hands-on projects", "difficulty": "Beginner", "duration_hours": 30},
        {"category_id": 1, "name": "Java Programming", "description": "Complete Java course with OOP concepts", "difficulty": "Intermediate", "duration_hours": 35},
        {"category_id": 1, "name": "C++ Programming", "description": "Master C++ programming from basics to advanced", "difficulty": "Intermediate", "duration_hours": 30},
        {"category_id": 1, "name": "JavaScript Fundamentals", "description": "Learn JavaScript for web development", "difficulty": "Beginner", "duration_hours": 25},
        
        # Machine Learning & AI (category_id=3)
        {"category_id": 3, "name": "Machine Learning Basics", "description": "Introduction to ML algorithms and concepts", "difficulty": "Intermediate", "duration_hours": 45},
        {"category_id": 3, "name": "Deep Learning", "description": "Neural networks, CNN, RNN with TensorFlow", "difficulty": "Advanced", "duration_hours": 50},
        {"category_id": 3, "name": "Natural Language Processing", "description": "NLP with Python and transformers", "difficulty": "Advanced", "duration_hours": 40},
        
        # Web Development (category_id=4)
        {"category_id": 4, "name": "Full Stack Web Development", "description": "HTML, CSS, JavaScript, React, Node.js", "difficulty": "Intermediate", "duration_hours": 60},
        {"category_id": 4, "name": "React.js Masterclass", "description": "Build modern web apps with React", "difficulty": "Intermediate", "duration_hours": 35},
        
        # Database Systems (category_id=5)
        {"category_id": 5, "name": "SQL Mastery", "description": "Complete SQL from basics to advanced queries", "difficulty": "Beginner", "duration_hours": 25},
        {"category_id": 5, "name": "PostgreSQL Deep Dive", "description": "Advanced PostgreSQL for developers", "difficulty": "Intermediate", "duration_hours": 30},
        
        # DevOps & Cloud (category_id=6)
        {"category_id": 6, "name": "Docker & Kubernetes", "description": "Container orchestration from scratch", "difficulty": "Intermediate", "duration_hours": 40},
        {"category_id": 6, "name": "AWS Cloud Practitioner", "description": "AWS fundamentals and certification prep", "difficulty": "Beginner", "duration_hours": 35},
    ]
    
    for course_data in courses:
        course = Course(**course_data)
        db.add(course)
    
    db.commit()
    print(f"✅ Seeded {len(courses)} courses")
    db.close()


if __name__ == "__main__":
    print("🌱 Seeding database...")
    seed_categories()
    seed_courses()
    print("🎉 Seeding complete!")