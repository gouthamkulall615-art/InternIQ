import { forwardRef } from 'react';

const ResumePreview = forwardRef(({ resumeData }, ref) => {
  const { personal, summary, experience, education, projects, skills } = resumeData;

  const renderBullets = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      const trimmed = line.trim().replace(/^- /, '');
      if (!trimmed) return null;
      return <li key={i} className="ml-4 list-disc text-sm">{trimmed}</li>;
    });
  };

  return (
    <div ref={ref} className="bg-white text-black p-10 min-h-[1056px] w-[816px] shadow-sm font-sans" style={{ boxSizing: 'border-box' }}>
      {/* Header */}
      <div className="text-center border-b-2 border-gray-800 pb-4 mb-4">
        <h1 className="text-3xl font-bold uppercase tracking-wider text-gray-900">{personal.name || 'YOUR NAME'}</h1>
        <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>• {personal.phone}</span>}
          {personal.location && <span>• {personal.location}</span>}
          {personal.linkedin && <span>• {personal.linkedin}</span>}
          {personal.github && <span>• {personal.github}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-4">
          <p className="text-sm leading-relaxed text-gray-800">{summary}</p>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-2 text-gray-800">Education</h2>
          {education.map((edu, idx) => (
            <div key={idx} className="mb-2">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-gray-900">{edu.school || 'School Name'}</h3>
                <span className="text-sm font-medium text-gray-700">{edu.year}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="italic text-sm text-gray-800">{edu.degree || 'Degree Name'}</span>
                {edu.gpa && <span className="text-sm text-gray-600">GPA: {edu.gpa}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-2 text-gray-800">Experience</h2>
          {experience.map((exp, idx) => (
            <div key={idx} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-gray-900">{exp.company || 'Company Name'}</h3>
                <span className="text-sm font-medium text-gray-700">{exp.duration}</span>
              </div>
              <div className="italic text-sm mb-1 text-gray-800">{exp.role || 'Job Title'}</div>
              <ul className="text-gray-800">
                {renderBullets(exp.description)}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-2 text-gray-800">Projects</h2>
          {projects.map((proj, idx) => (
            <div key={idx} className="mb-2">
              <div className="flex items-baseline gap-2">
                <h3 className="font-bold text-gray-900">{proj.name || 'Project Name'}</h3>
                {proj.techStack && <span className="text-sm italic text-gray-600">| {proj.techStack}</span>}
              </div>
              <ul className="text-gray-800 mt-1">
                {renderBullets(proj.description)}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-2 text-gray-800">Skills</h2>
          <p className="text-sm text-gray-800">
            {skills.join(', ')}
          </p>
        </div>
      )}
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';
export default ResumePreview;
