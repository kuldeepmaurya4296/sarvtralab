'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Users, Star, ArrowRight, IndianRupee } from 'lucide-react';
import { courses, courseCategories } from '@/data/courses';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
const roboticsIllustration = '/robotics-illustration.jpg';

const CoursesSection = () => {
  const featuredCourses = courses.slice(0, 3);

  return (
    <section className="py-20 md:py-28 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="badge-secondary mb-4 inline-block"
          >
            Our Programs
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-heading"
          >
            CBSE-Aligned
            <span className="block gradient-text-secondary">Robotics Courses</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="section-subheading"
          >
            From beginners to advanced learners, we have the perfect track for every student.
          </motion.p>
        </div>

        {/* Category Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {courseCategories.map((category) => (
            <div
              key={category.id}
              className={`px-6 py-3 rounded-full border-2 transition-all cursor-pointer
                ${category.id === 'foundation' ? 'border-primary bg-primary/5 text-primary' :
                  category.id === 'intermediate' ? 'border-secondary bg-secondary/5 text-secondary' :
                    'border-accent bg-accent/5 text-accent'
                }`}
            >
              <span className="font-semibold">{category.name}</span>
              <span className="text-sm opacity-70 ml-2">({category.grades})</span>
            </div>
          ))}
        </motion.div>

        {/* Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featuredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="course-card"
            >
              {/* Image */}
              <div className="course-card-image">
                <Image
                  src="/robotics-illustration.jpg"
                  alt={course.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 z-10">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${course.category === 'foundation' ? 'bg-primary text-primary-foreground' :
                      course.category === 'intermediate' ? 'bg-secondary text-secondary-foreground' :
                        'bg-accent text-accent-foreground'
                    }`}>
                    {course.grade}
                  </span>
                </div>
                {course.emiAvailable && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="emi-badge">
                      <IndianRupee className="w-3 h-3" />
                      0% EMI
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {course.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.totalHours} hrs</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course.studentsEnrolled.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-secondary text-secondary" />
                    <span>{course.rating}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <span className="text-2xl font-bold text-foreground">
                      ₹{course.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground line-through ml-2">
                      ₹{course.originalPrice.toLocaleString()}
                    </span>
                  </div>
                  <Link href={`/courses/${course.id}`}>
                    <Button size="sm" variant="outline" className="gap-1">
                      View <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                {course.emiAvailable && (
                  <p className="text-xs text-success mt-2">
                    EMI from ₹{course.emiAmount?.toLocaleString()}/month
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/courses">
            <Button size="lg" className="btn-hero-secondary">
              View All Courses
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CoursesSection;


