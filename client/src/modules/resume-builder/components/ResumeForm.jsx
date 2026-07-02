export default function ResumeForm({ resumeData, setResumeData }) {
  const handleChange = (section, field, value, index = null) => {
    setResumeData((prev) => {
      const newData = { ...prev };
      if (index !== null) {
        newData[section][index] = { ...newData[section][index], [field]: value };
      } else if (section === 'personal') {
        newData.personal = { ...newData.personal, [field]: value };
      } else if (section === 'summary') {
        newData.summary = value;
      }
      return newData;
    });
  };

  const addArrayItem = (section, defaultItem) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: [...prev[section], defaultItem]
    }));
  };

  const removeArrayItem = (section, index) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  // Shared classes — 16px base font, 44px min height for touch
  const inputClass = "w-full px-3 py-2.5 text-base rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent transition-colors min-h-[44px]";
  const sectionTitle = "text-base font-semibold text-gray-900 dark:text-white";
  const cardClass = "border border-gray-200 dark:border-gray-800 p-4 rounded-xl relative bg-gray-50 dark:bg-gray-800/30 transition-colors";
  const addBtnClass = "text-sm font-medium text-[#0A66C2] hover:text-[#004182] dark:text-[#3B82F6] dark:hover:text-[#60A5FA] transition-colors";
  const removeBtnClass = "absolute top-3 right-3 text-sm font-medium text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center";

  return (
    <div className="space-y-8 pb-12">
      {/* Personal Info */}
      <section>
        <h3 className={`${sectionTitle} border-b border-gray-200 dark:border-gray-800 pb-2 mb-4`}>Personal Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <input className={inputClass} placeholder="Full Name"
            value={resumeData.personal.name}
            onChange={(e) => handleChange('personal', 'name', e.target.value)} />
          <input className={inputClass} placeholder="Email"
            value={resumeData.personal.email}
            onChange={(e) => handleChange('personal', 'email', e.target.value)} />
          <input className={inputClass} placeholder="Phone"
            value={resumeData.personal.phone}
            onChange={(e) => handleChange('personal', 'phone', e.target.value)} />
          <input className={inputClass} placeholder="Location (City, State)"
            value={resumeData.personal.location}
            onChange={(e) => handleChange('personal', 'location', e.target.value)} />
          <input className={inputClass} placeholder="LinkedIn URL"
            value={resumeData.personal.linkedin}
            onChange={(e) => handleChange('personal', 'linkedin', e.target.value)} />
          <input className={inputClass} placeholder="GitHub / Portfolio URL"
            value={resumeData.personal.github}
            onChange={(e) => handleChange('personal', 'github', e.target.value)} />
        </div>
      </section>

      {/* Summary */}
      <section>
        <h3 className={`${sectionTitle} border-b border-gray-200 dark:border-gray-800 pb-2 mb-4`}>Professional Summary</h3>
        <textarea
          className={`${inputClass} h-24 resize-y`}
          placeholder="A brief summary of your background and goals..."
          value={resumeData.summary}
          onChange={(e) => handleChange('summary', null, e.target.value)}
        />
      </section>

      {/* Experience */}
      <section>
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-2 mb-4">
          <h3 className={sectionTitle}>Experience</h3>
          <button
            onClick={() => addArrayItem('experience', { company: '', role: '', duration: '', description: '' })}
            className={addBtnClass}
          >
            + Add
          </button>
        </div>
        <div className="space-y-4">
          {resumeData.experience.map((exp, index) => (
            <div key={index} className={cardClass}>
              <button onClick={() => removeArrayItem('experience', index)} className={removeBtnClass}>Remove</button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 pr-16 sm:pr-0">
                <input className={inputClass} placeholder="Company" value={exp.company} onChange={(e) => handleChange('experience', 'company', e.target.value, index)} />
                <input className={inputClass} placeholder="Role/Title" value={exp.role} onChange={(e) => handleChange('experience', 'role', e.target.value, index)} />
                <input className={`${inputClass} sm:col-span-2`} placeholder="Duration (e.g. May 2023 — Aug 2023)" value={exp.duration} onChange={(e) => handleChange('experience', 'duration', e.target.value, index)} />
              </div>
              <textarea className={`${inputClass} h-24 resize-y`} placeholder="Description of achievements (bullet points recommended)..." value={exp.description} onChange={(e) => handleChange('experience', 'description', e.target.value, index)} />
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section>
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-2 mb-4">
          <h3 className={sectionTitle}>Education</h3>
          <button
            onClick={() => addArrayItem('education', { school: '', degree: '', year: '', gpa: '' })}
            className={addBtnClass}
          >
            + Add
          </button>
        </div>
        <div className="space-y-4">
          {resumeData.education.map((edu, index) => (
            <div key={index} className={cardClass}>
              <button onClick={() => removeArrayItem('education', index)} className={removeBtnClass}>Remove</button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-16 sm:pr-0">
                <input className={inputClass} placeholder="School/University" value={edu.school} onChange={(e) => handleChange('education', 'school', e.target.value, index)} />
                <input className={inputClass} placeholder="Degree/Major" value={edu.degree} onChange={(e) => handleChange('education', 'degree', e.target.value, index)} />
                <input className={inputClass} placeholder="Graduation Year" value={edu.year} onChange={(e) => handleChange('education', 'year', e.target.value, index)} />
                <input className={inputClass} placeholder="GPA (optional)" value={edu.gpa} onChange={(e) => handleChange('education', 'gpa', e.target.value, index)} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section>
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-2 mb-4">
          <h3 className={sectionTitle}>Projects</h3>
          <button
            onClick={() => addArrayItem('projects', { name: '', techStack: '', description: '' })}
            className={addBtnClass}
          >
            + Add
          </button>
        </div>
        <div className="space-y-4">
          {resumeData.projects.map((proj, index) => (
            <div key={index} className={cardClass}>
              <button onClick={() => removeArrayItem('projects', index)} className={removeBtnClass}>Remove</button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 pr-16 sm:pr-0">
                <input className={inputClass} placeholder="Project Name" value={proj.name} onChange={(e) => handleChange('projects', 'name', e.target.value, index)} />
                <input className={inputClass} placeholder="Tech Stack" value={proj.techStack} onChange={(e) => handleChange('projects', 'techStack', e.target.value, index)} />
              </div>
              <textarea className={`${inputClass} h-20 resize-y`} placeholder="Description of project..." value={proj.description} onChange={(e) => handleChange('projects', 'description', e.target.value, index)} />
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section>
        <h3 className={`${sectionTitle} border-b border-gray-200 dark:border-gray-800 pb-2 mb-4`}>Skills</h3>
        <textarea
          className={`${inputClass} h-20 resize-y`}
          placeholder="List your skills separated by commas (e.g. JavaScript, React, Node.js, Python)..."
          value={resumeData.skills.join(', ')}
          onChange={(e) => {
            const skillsArray = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
            setResumeData((prev) => ({ ...prev, skills: skillsArray }));
          }}
        />
      </section>
    </div>
  );
}
