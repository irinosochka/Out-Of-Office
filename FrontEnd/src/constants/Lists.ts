

export const subdivisions = ['HR', 'Quality Assurance (QA)', 'Engineering', 'Product Management', 'Data Science and Analytics'];

export const positionsBySubdivision: { [key: string]: string[] } = {
    'HR': ['HR Manager', 'Recruiter'],
    'Quality Assurance (QA)': ['QA Engineer', 'Test Automation Engineer', 'QA Lead'],
    'Engineering': ['Software Developer', 'Front-End Developer', 'Back-End Developer', 'Mobile App Developer', 'DevOps Engineer'],
    'Product Management': ['Product Owner', 'Project Manager', 'Scrum Master'],
    'Data Science and Analytics': ['Data Scientist', 'Data Analyst', 'Machine Learning Engineer', 'Big Data Engineer']
};

export const projectTypes = ['Standard building projects', 'Non-standard building projects', 'Standard civil engineering projects',
                            'Non-standard civil engineering projects', 'Development and equipment projects', 'Outsourcing projects' ]
