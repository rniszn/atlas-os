import { useState } from 'react';
import { Code, BookOpen, Zap, Award, CheckCircle, Lock } from 'lucide-react';

const skillCategories = {
  'Web Technologies': {
    icon: Code,
    color: 'blue',
    skills: [
      { name: 'HTML & CSS', level: 90, completed: true, description: 'Semantic markup and modern styling' },
      { name: 'JavaScript ES6+', level: 85, completed: true, description: 'Modern JavaScript features and patterns' },
      { name: 'React & Next.js', level: 75, completed: true, description: 'Component-based architecture and SSR' },
      { name: 'TypeScript', level: 60, completed: false, description: 'Type safety and interfaces' },
      { name: 'Node.js & Express', level: 70, completed: true, description: 'Backend development and APIs' },
      { name: 'Database Design', level: 55, completed: false, description: 'SQL and NoSQL databases' },
      { name: 'Cloud Deployment', level: 40, completed: false, description: 'AWS, Vercel, and CI/CD' }
    ]
  },
  '100 Days of ML': {
    icon: BookOpen,
    color: 'green',
    skills: [
      { name: 'Python Fundamentals', level: 95, completed: true, description: 'Core Python programming' },
      { name: 'NumPy & Pandas', level: 80, completed: true, description: 'Data manipulation and analysis' },
      { name: 'Data Visualization', level: 70, completed: true, description: 'Matplotlib, Seaborn, Plotly' },
      { name: 'Linear Algebra', level: 65, completed: false, description: 'Mathematical foundations' },
      { name: 'Supervised Learning', level: 50, completed: false, description: 'Classification and regression' },
      { name: 'Neural Networks', level: 35, completed: false, description: 'Deep learning fundamentals' },
      { name: 'Computer Vision', level: 25, completed: false, description: 'Image processing and CNNs' }
    ]
  }
};

const colorClasses = {
  blue: {
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/30',
    text: 'text-blue-300',
    progress: 'bg-blue-500',
    icon: 'text-blue-400'
  },
  green: {
    bg: 'bg-green-500/20',
    border: 'border-green-500/30',
    text: 'text-green-300',
    progress: 'bg-green-500',
    icon: 'text-green-400'
  }
};

export default function CurriculumPanel() {
  const [selectedCategory, setSelectedCategory] = useState('Web Technologies');
  const [expandedSkill, setExpandedSkill] = useState(null);

  const currentCategory = skillCategories[selectedCategory];
  const totalSkills = Object.values(skillCategories).reduce((acc, cat) => acc + cat.skills.length, 0);
  const completedSkills = Object.values(skillCategories).reduce((acc, cat) => 
    acc + cat.skills.filter(skill => skill.completed).length, 0);

  const overallProgress = (completedSkills / totalSkills) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">Learning Path</h2>
          <p className="text-sm text-slate-400">Track your progress through the curriculum</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-violet-300">{Math.round(overallProgress)}%</div>
          <div className="text-xs text-slate-500">Overall Progress</div>
        </div>
      </div>

      <div className="p-4 rounded-lg border border-white/[0.08] bg-[rgba(15,23,42,0.4)] backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-300">Total Progress</span>
          <span className="text-xs text-slate-500">{completedSkills}/{totalSkills} skills</span>
        </div>
        <div className="w-full bg-slate-700/50 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-violet-500 to-purple-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      <div className="flex gap-2">
        {Object.keys(skillCategories).map((category) => {
          const Icon = skillCategories[category].icon;
          const colors = colorClasses[skillCategories[category].color];
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex-1 flex items-center gap-2 px-4 py-3 rounded-lg border transition-all ${
                selectedCategory === category
                  ? `${colors.bg} ${colors.border} ${colors.text}`
                  : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-700/50'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{category}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {currentCategory.skills.map((skill, index) => {
          const colors = colorClasses[currentCategory.color];
          const isExpanded = expandedSkill === index;
          
          return (
            <div
              key={skill.name}
              className={`group relative rounded-lg border border-white/[0.08] bg-[rgba(15,23,42,0.4)] backdrop-blur-sm transition-all hover:border-violet-500/30 hover:bg-[rgba(139,92,246,0.05)] ${
                skill.completed ? 'opacity-90' : 'opacity-70'
              }`}
            >
              <div
                className="p-4 cursor-pointer"
                onClick={() => setExpandedSkill(isExpanded ? null : index)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${colors.bg} border ${colors.border}`}>
                      {skill.completed ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <Lock className="h-4 w-4 text-slate-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-violet-300 transition-colors">
                        {skill.name}
                      </h3>
                      <p className="text-xs text-slate-500">{skill.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-300">{skill.level}%</div>
                    <div className="text-xs text-slate-500">
                      {skill.completed ? 'Completed' : 'In Progress'}
                    </div>
                  </div>
                </div>
                
                <div className="w-full bg-slate-700/50 rounded-full h-1.5">
                  <div 
                    className={`${colors.progress} h-1.5 rounded-full transition-all duration-500`}
                    style={{ width: `${skill.level}%` }}
                  />
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-white/[0.08]">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500">Status:</span>
                        <span className={`ml-2 ${skill.completed ? 'text-green-400' : 'text-yellow-400'}`}>
                          {skill.completed ? 'Completed' : 'In Progress'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">Progress:</span>
                        <span className="ml-2 text-slate-300">{skill.level}%</span>
                      </div>
                    </div>
                    {skill.completed && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-green-400">
                        <Award className="h-3 w-3" />
                        <span>Skill mastered! Keep up the great work.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 rounded-lg border border-white/[0.08] bg-gradient-to-br from-violet-500/10 to-purple-600/10 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="h-4 w-4 text-violet-400" />
          <h3 className="text-sm font-semibold text-white">Current Focus</h3>
        </div>
        <p className="text-xs text-slate-300">
          Continue with {currentCategory.skills.find(s => !s.completed)?.name || 'all skills completed!'} 
          to advance your learning journey.
        </p>
      </div>
    </div>
  );
}
