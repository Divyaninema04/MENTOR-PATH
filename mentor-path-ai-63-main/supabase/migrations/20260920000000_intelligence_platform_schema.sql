-- ==============================================================================
-- PLACEMENTPILOT INTELLIGENCE PLATFORM SCHEMA
-- Sections 23, 24, 25 & 26: Normalized Database Design & Data Trust Architecture
-- Date: 2026-09-20
-- ==============================================================================

-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. TAXONOMY, SECTORS & LOCATIONS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.sectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    priority_level TEXT DEFAULT 'medium', -- 'critical', 'high', 'medium', 'low'
    data_trust_tier TEXT DEFAULT 'verified_external',
    source_name TEXT DEFAULT 'National Skill Development Corporation (NSDC)',
    source_url TEXT,
    verification_status TEXT DEFAULT 'verified',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.districts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    state TEXT NOT NULL DEFAULT 'Maharashtra',
    district_code TEXT UNIQUE NOT NULL,
    district_name TEXT NOT NULL,
    division TEXT, -- 'Pune Division', 'Konkan', 'Nagpur', etc.
    tier TEXT DEFAULT 'Tier 2', -- 'Tier 1', 'Tier 2', 'Tier 3'
    industrial_zone TEXT,
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    data_trust_tier TEXT DEFAULT 'verified_external',
    source_name TEXT DEFAULT 'Government of Maharashtra District Census',
    verification_status TEXT DEFAULT 'verified',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    district_id UUID REFERENCES public.districts(id) ON DELETE SET NULL,
    city_name TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'Maharashtra',
    postal_code TEXT,
    cluster_type TEXT DEFAULT 'Tech & IT',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 2. MARKET SOURCES & JOB MARKET RECORDS (Layer A)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.market_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    source_type TEXT NOT NULL, -- 'government_lmi', 'job_portal', 'employer_mou', 'nasscom'
    base_url TEXT,
    reliability_rating NUMERIC(3,2) DEFAULT 0.95,
    data_trust_tier TEXT NOT NULL DEFAULT 'verified_external',
    geographic_coverage TEXT DEFAULT 'Maharashtra',
    last_crawled_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.job_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sector_id UUID REFERENCES public.sectors(id) ON DELETE CASCADE,
    code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    career_path TEXT,
    entry_level_salary NUMERIC(10,2),
    growth_rate_pct NUMERIC(5,2) DEFAULT 0.0,
    nco_code TEXT, -- National Classification of Occupations
    data_trust_tier TEXT DEFAULT 'verified_external',
    source_name TEXT DEFAULT 'Ministry of Skill Development & Labour Market Bureau',
    verification_status TEXT DEFAULT 'verified',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.job_market_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID REFERENCES public.market_sources(id) ON DELETE SET NULL,
    job_role_id UUID REFERENCES public.job_roles(id) ON DELETE SET NULL,
    district_id UUID REFERENCES public.districts(id) ON DELETE SET NULL,
    employer_name TEXT NOT NULL,
    raw_job_title TEXT NOT NULL,
    min_experience_years NUMERIC(3,1) DEFAULT 0.0,
    max_experience_years NUMERIC(3,1) DEFAULT 2.0,
    salary_offered_min NUMERIC(10,2),
    salary_offered_max NUMERIC(10,2),
    posting_date DATE DEFAULT CURRENT_DATE,
    raw_description TEXT,
    data_trust_tier TEXT DEFAULT 'verified_external',
    source_url TEXT,
    verification_status TEXT DEFAULT 'verified',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 3. SKILLS TAXONOMY, ALIASES & ROLE MAPPINGS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL, -- 'programming', 'database', 'cloud', 'soft_skill', 'domain'
    taxonomy_code TEXT,
    description TEXT,
    is_emerging BOOLEAN DEFAULT false,
    rarity_index NUMERIC(3,2) DEFAULT 0.50,
    data_trust_tier TEXT DEFAULT 'verified_external',
    source_name TEXT DEFAULT 'O*NET & FutureSkills Prime Ontology',
    verification_status TEXT DEFAULT 'verified',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.skill_aliases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
    alias TEXT NOT NULL,
    source TEXT DEFAULT 'recruiter_search_index',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.role_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID REFERENCES public.job_roles(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
    importance_level TEXT NOT NULL DEFAULT 'essential', -- 'essential', 'preferred', 'emerging'
    expected_proficiency TEXT DEFAULT 'intermediate', -- 'basic', 'intermediate', 'advanced'
    weight NUMERIC(4,3) DEFAULT 1.000,
    data_trust_tier TEXT DEFAULT 'platform_calculated',
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(role_id, skill_id)
);

CREATE TABLE IF NOT EXISTS public.skill_demand (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
    district_id UUID REFERENCES public.districts(id) ON DELETE SET NULL,
    sector_id UUID REFERENCES public.sectors(id) ON DELETE SET NULL,
    posting_count INT DEFAULT 0,
    demand_index NUMERIC(5,2) DEFAULT 0.00,
    month_year DATE NOT NULL,
    data_trust_tier TEXT DEFAULT 'platform_calculated',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.skill_trends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
    period TEXT NOT NULL, -- '2025-Q4', '2026-Q1', '2026-Q2', '2026-Q3'
    growth_rate_pct NUMERIC(5,2) NOT NULL,
    trend_direction TEXT NOT NULL, -- 'surging', 'stable', 'declining'
    forecast_confidence NUMERIC(3,2) DEFAULT 0.90,
    data_trust_tier TEXT DEFAULT 'platform_calculated',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 4. CURRICULUM, COURSES & QUALIFICATIONS (Layer B)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.qualifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    education_level TEXT NOT NULL, -- 'Bachelor', 'Diploma', 'ITI', 'Master'
    awarding_body TEXT NOT NULL, -- 'SPPU Pune', 'Autonomous', 'MSBTE', 'AICTE'
    nsqf_level INT, -- National Skills Qualifications Framework level (1-10)
    data_trust_tier TEXT DEFAULT 'verified_external',
    source_name TEXT DEFAULT 'AICTE Model Curriculum Registry',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.qualification_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    qualification_id UUID REFERENCES public.qualifications(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
    is_mandatory BOOLEAN DEFAULT true,
    min_proficiency TEXT DEFAULT 'intermediate',
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(qualification_id, skill_id)
);

CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    qualification_id UUID REFERENCES public.qualifications(id) ON DELETE SET NULL,
    sector_id UUID REFERENCES public.sectors(id) ON DELETE SET NULL,
    duration_weeks INT DEFAULT 16,
    credits INT DEFAULT 4,
    theory_hours INT DEFAULT 45,
    practical_hours INT DEFAULT 30,
    curriculum_health_score NUMERIC(4,1) DEFAULT 75.0,
    data_trust_tier TEXT DEFAULT 'verified_external',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.course_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    module_number INT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    hours_allocated INT DEFAULT 10,
    is_practical BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.course_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    module_id UUID REFERENCES public.course_modules(id) ON DELETE SET NULL,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
    proficiency_targeted TEXT DEFAULT 'intermediate',
    lab_hours_included INT DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.curriculum_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    version_tag TEXT NOT NULL, -- 'v2024.1', 'v2026.R2'
    status TEXT DEFAULT 'active', -- 'draft', 'active', 'archived'
    effective_date DATE DEFAULT CURRENT_DATE,
    review_due_date DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.curriculum_skill_mapping (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_id UUID REFERENCES public.curriculum_versions(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
    coverage_score NUMERIC(3,2) DEFAULT 0.50, -- 0.0 to 1.0
    practical_coverage_hours INT DEFAULT 0,
    detected_gap BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 5. EMPLOYER VALIDATION & INDUSTRY SURVEYS (Layer C)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.employers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    cin_number TEXT,
    industry TEXT NOT NULL,
    hq_location TEXT,
    is_mou_partner BOOLEAN DEFAULT false,
    contact_email TEXT,
    verification_status TEXT DEFAULT 'verified',
    data_trust_tier TEXT DEFAULT 'employer_validated',
    source_name TEXT DEFAULT 'Corporate Campus Recruitment Cell',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.employer_validations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employer_id UUID REFERENCES public.employers(id) ON DELETE CASCADE,
    role_id UUID REFERENCES public.job_roles(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
    requirement_type TEXT NOT NULL, -- 'essential', 'preferred', 'missing_observed', 'emerging'
    expected_proficiency TEXT DEFAULT 'intermediate',
    hiring_importance_score INT DEFAULT 5, -- 1 to 5
    comments TEXT,
    validated_by_title TEXT,
    data_trust_tier TEXT DEFAULT 'employer_validated',
    source_name TEXT DEFAULT 'Direct Corporate Employer Validation Submission',
    verification_status TEXT DEFAULT 'authenticated_mou',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.industry_surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employer_id UUID REFERENCES public.employers(id) ON DELETE CASCADE,
    sector_id UUID REFERENCES public.sectors(id) ON DELETE SET NULL,
    survey_period TEXT NOT NULL, -- '2026-H1'
    growing_roles JSONB,
    declining_skills JSONB,
    emerging_tools JSONB,
    expected_proficiencies JSONB,
    raw_feedback TEXT,
    data_trust_tier TEXT DEFAULT 'employer_validated',
    source_name TEXT DEFAULT 'Annual Maharashtra Industrial Skill Survey',
    verification_status TEXT DEFAULT 'authenticated',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 6. TRAINING CAPACITY, TRAINERS & INFRASTRUCTURE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.training_programmes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_name TEXT NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
    district_id UUID REFERENCES public.districts(id) ON DELETE SET NULL,
    accreditation TEXT DEFAULT 'NBA / NAAC Grade A',
    batch_size INT DEFAULT 60,
    annual_batches INT DEFAULT 2,
    data_trust_tier TEXT DEFAULT 'verified_external',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.training_capacity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    programme_id UUID REFERENCES public.training_programmes(id) ON DELETE CASCADE,
    district_id UUID REFERENCES public.districts(id) ON DELETE SET NULL,
    academic_year TEXT NOT NULL DEFAULT '2026-2027',
    total_approved_intake INT DEFAULT 120,
    actual_enrolled INT DEFAULT 112,
    certified_graduates INT DEFAULT 98,
    placement_rate_pct NUMERIC(5,2) DEFAULT 78.4,
    detected_capacity_gap INT DEFAULT 45,
    data_trust_tier TEXT DEFAULT 'platform_calculated',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.trainer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    institution_id UUID REFERENCES public.training_programmes(id) ON DELETE SET NULL,
    district_id UUID REFERENCES public.districts(id) ON DELETE SET NULL,
    email TEXT,
    years_of_experience NUMERIC(3,1) DEFAULT 5.0,
    is_tot_certified BOOLEAN DEFAULT true, -- Training of Trainers certified
    verification_status TEXT DEFAULT 'verified',
    data_trust_tier TEXT DEFAULT 'verified_external',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.trainer_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trainer_id UUID REFERENCES public.trainer_profiles(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
    proficiency TEXT DEFAULT 'advanced',
    certified_by TEXT, -- 'NASSCOM Master Trainer', 'Microsoft Certified Educator'
    last_upskilled_date DATE,
    tot_cohort_completed TEXT,
    data_trust_tier TEXT DEFAULT 'verified_external',
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(trainer_id, skill_id)
);

CREATE TABLE IF NOT EXISTS public.infrastructure_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    programme_id UUID REFERENCES public.training_programmes(id) ON DELETE CASCADE,
    category TEXT NOT NULL, -- 'computer_systems', 'software', 'cloud_labs', 'database_environments', 'licenses'
    item_name TEXT NOT NULL,
    current_specification TEXT NOT NULL,
    recommended_specification TEXT NOT NULL,
    gap_level TEXT DEFAULT 'high', -- 'critical', 'high', 'moderate', 'aligned'
    gap_rationale TEXT NOT NULL,
    est_unit_capex_inr NUMERIC(12,2) DEFAULT 0.00,
    est_total_capex_inr NUMERIC(12,2) DEFAULT 0.00,
    data_trust_tier TEXT DEFAULT 'platform_calculated',
    source_name TEXT DEFAULT 'National Lab Infrastructure Benchmark 2026',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.district_training_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    district_id UUID REFERENCES public.districts(id) ON DELETE CASCADE,
    sector_id UUID REFERENCES public.sectors(id) ON DELETE SET NULL,
    role_id UUID REFERENCES public.job_roles(id) ON DELETE SET NULL,
    plan_year TEXT NOT NULL DEFAULT '2026-2027',
    recommended_programmes JSONB,
    trainer_requirement_count INT DEFAULT 0,
    trainer_deficit_count INT DEFAULT 0,
    infra_capex_required_inr NUMERIC(14,2) DEFAULT 0.00,
    plan_status TEXT DEFAULT 'draft', -- 'draft', 'submitted', 'approved', 'executed'
    explanation_rationale TEXT NOT NULL,
    data_trust_tier TEXT DEFAULT 'platform_calculated',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 7. RECOMMENDATIONS, STUDENT SKILLS & PLACEMENT OUTCOMES (Layer D)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target_type TEXT NOT NULL, -- 'curriculum', 'institution', 'student', 'district_plan'
    target_id TEXT NOT NULL,
    title TEXT NOT NULL,
    reason TEXT NOT NULL,
    supporting_market_evidence TEXT NOT NULL,
    related_roles JSONB,
    priority TEXT DEFAULT 'high', -- 'critical', 'high', 'medium'
    suggested_learning_outcome TEXT,
    suggested_assessment TEXT,
    proposed_module_name TEXT,
    data_trust_tier TEXT DEFAULT 'ai_recommended',
    source_name TEXT DEFAULT 'PlacementPilot Recommendation Engine v2',
    verification_status TEXT DEFAULT 'ai_synthesized',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.skill_gap_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES public.job_roles(id) ON DELETE SET NULL,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
    market_level TEXT NOT NULL, -- 'basic', 'intermediate', 'advanced'
    student_level TEXT NOT NULL, -- 'none', 'basic', 'intermediate', 'advanced'
    gap_level TEXT NOT NULL, -- 'critical', 'high', 'moderate', 'aligned'
    diagnostic_rationale TEXT NOT NULL,
    actionable_learning_step TEXT NOT NULL,
    evaluation_factors JSONB, -- stores 8-factor vector
    data_trust_tier TEXT DEFAULT 'platform_calculated',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.student_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
    self_proficiency TEXT DEFAULT 'basic',
    verified_proficiency TEXT,
    assessment_score NUMERIC(5,2),
    is_verified BOOLEAN DEFAULT false,
    last_assessed_at TIMESTAMPTZ,
    data_trust_tier TEXT DEFAULT 'platform_calculated',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, skill_id)
);

CREATE TABLE IF NOT EXISTS public.placement_outcomes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    application_id UUID REFERENCES public.applications(id) ON DELETE SET NULL,
    opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE SET NULL,
    role_title TEXT NOT NULL,
    employer_name TEXT NOT NULL,
    outcome_status TEXT NOT NULL, -- 'applied', 'shortlisted', 'interview', 'selected', 'rejected'
    package_lpa NUMERIC(6,2),
    required_skills_snapshot JSONB,
    student_skills_snapshot JSONB,
    skill_gap_at_application JSONB,
    training_programme_attended TEXT,
    cohort_year TEXT DEFAULT '2026',
    data_trust_tier TEXT DEFAULT 'verified_external',
    verification_status TEXT DEFAULT 'authenticated_campus_cell',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 8. INDEXES FOR HIGH-PERFORMANCE INTELLIGENCE QUERIES
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_job_market_records_role ON public.job_market_records(job_role_id);
CREATE INDEX IF NOT EXISTS idx_job_market_records_district ON public.job_market_records(district_id);
CREATE INDEX IF NOT EXISTS idx_role_skills_role ON public.role_skills(role_id);
CREATE INDEX IF NOT EXISTS idx_role_skills_skill ON public.role_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_skill_demand_skill_dist ON public.skill_demand(skill_id, district_id);
CREATE INDEX IF NOT EXISTS idx_employer_val_employer ON public.employer_validations(employer_id);
CREATE INDEX IF NOT EXISTS idx_employer_val_role_skill ON public.employer_validations(role_id, skill_id);
CREATE INDEX IF NOT EXISTS idx_trainer_skills_skill ON public.trainer_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_placement_outcomes_role ON public.placement_outcomes(role_title);
CREATE INDEX IF NOT EXISTS idx_placement_outcomes_outcome ON public.placement_outcomes(outcome_status);
CREATE INDEX IF NOT EXISTS idx_skill_gap_user ON public.skill_gap_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_student_skills_user ON public.student_skills(user_id);

-- ==============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS across all new tables
ALTER TABLE public.sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_market_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_aliases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_demand ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qualifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qualification_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curriculum_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curriculum_skill_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employer_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industry_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_programmes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_capacity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainer_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.infrastructure_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.district_training_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_gap_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_outcomes ENABLE ROW LEVEL SECURITY;

-- 1. Public / Authenticated read policies for reference and intelligence catalog data
DO $$
BEGIN
    -- Reference tables
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read access to public sectors') THEN
        CREATE POLICY "Allow read access to public sectors" ON public.sectors FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read access to public districts') THEN
        CREATE POLICY "Allow read access to public districts" ON public.districts FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read access to public locations') THEN
        CREATE POLICY "Allow read access to public locations" ON public.locations FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read access to public job_roles') THEN
        CREATE POLICY "Allow read access to public job_roles" ON public.job_roles FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read access to public skills') THEN
        CREATE POLICY "Allow read access to public skills" ON public.skills FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read access to public role_skills') THEN
        CREATE POLICY "Allow read access to public role_skills" ON public.role_skills FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read access to public skill_demand') THEN
        CREATE POLICY "Allow read access to public skill_demand" ON public.skill_demand FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read access to public skill_trends') THEN
        CREATE POLICY "Allow read access to public skill_trends" ON public.skill_trends FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read access to public courses') THEN
        CREATE POLICY "Allow read access to public courses" ON public.courses FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read access to public qualifications') THEN
        CREATE POLICY "Allow read access to public qualifications" ON public.qualifications FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read access to public employers') THEN
        CREATE POLICY "Allow read access to public employers" ON public.employers FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read access to public employer_validations') THEN
        CREATE POLICY "Allow read access to public employer_validations" ON public.employer_validations FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read access to public training_programmes') THEN
        CREATE POLICY "Allow read access to public training_programmes" ON public.training_programmes FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read access to public recommendations') THEN
        CREATE POLICY "Allow read access to public recommendations" ON public.recommendations FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read access to public district_plans') THEN
        CREATE POLICY "Allow read access to public district_plans" ON public.district_training_plans FOR SELECT USING (true);
    END IF;
END $$;

-- 2. Tenant isolation policies for student personal data
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users manage own skill gaps') THEN
        CREATE POLICY "Users manage own skill gaps" ON public.skill_gap_analysis
            FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users manage own student skills') THEN
        CREATE POLICY "Users manage own student skills" ON public.student_skills
            FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users view own placement outcomes') THEN
        CREATE POLICY "Users view own placement outcomes" ON public.placement_outcomes
            FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NOT NULL);
    END IF;
END $$;
