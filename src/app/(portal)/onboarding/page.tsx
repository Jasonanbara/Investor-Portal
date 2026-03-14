'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Upload,
  BarChart3,
  FileSignature,
  Compass,
  LayoutDashboard,
  Search,
  Handshake,
  MessageCircle,
  FileBarChart,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { StepIndicator } from '@/components/onboarding/step-indicator';
import { OnboardingStep } from '@/components/onboarding/onboarding-step';

const STEPS = [
  { number: 1, label: 'Profile' },
  { number: 2, label: 'KYC Docs' },
  { number: 3, label: 'Preferences' },
  { number: 4, label: 'Sign NDA' },
  { number: 5, label: 'Tour' },
];

const STORAGE_KEY = 'northlend_onboarding_progress';

interface ProfileData {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
}

interface PreferencesData {
  riskTolerance: string;
  minDealSize: string;
  maxDealSize: string;
  propertyTypes: string[];
}

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Step 1: Profile data
  const [profile, setProfile] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
  });

  // Step 2: KYC uploads
  const [governmentId, setGovernmentId] = useState<File | null>(null);
  const [proofOfAddress, setProofOfAddress] = useState<File | null>(null);
  const [accreditation, setAccreditation] = useState<File | null>(null);

  // Step 3: Preferences
  const [preferences, setPreferences] = useState<PreferencesData>({
    riskTolerance: '',
    minDealSize: '',
    maxDealSize: '',
    propertyTypes: [],
  });

  // Step 4: NDA
  const [ndaAccepted, setNdaAccepted] = useState(false);
  const [ndaFullName, setNdaFullName] = useState('');

  // Step validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Restore progress from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.currentStep) setCurrentStep(data.currentStep);
        if (data.completedSteps) setCompletedSteps(data.completedSteps);
        if (data.profile) setProfile(data.profile);
        if (data.preferences) setPreferences(data.preferences);
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ currentStep, completedSteps, profile, preferences })
      );
    } catch {
      // ignore storage errors
    }
  }, [currentStep, completedSteps, profile, preferences]);

  const markCompleted = (step: number) => {
    setCompletedSteps((prev) =>
      prev.includes(step) ? prev : [...prev, step]
    );
  };

  const goToNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!profile.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!profile.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!profile.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!profile.address.trim()) newErrors.address = 'Address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStep1Next = () => {
    if (validateStep1()) {
      markCompleted(1);
      goToNext();
    }
  };

  const handleStep2Next = () => {
    markCompleted(2);
    goToNext();
  };

  const handleStep2Skip = () => {
    // Don't mark completed but still advance
    goToNext();
  };

  const handleStep3Next = () => {
    if (preferences.riskTolerance) {
      markCompleted(3);
      goToNext();
    } else {
      setErrors({ riskTolerance: 'Please select a risk tolerance level' });
    }
  };

  const handleStep4Next = () => {
    if (ndaAccepted && ndaFullName.trim()) {
      markCompleted(4);
      goToNext();
    }
  };

  const handleStep4Skip = () => {
    goToNext();
  };

  const handleComplete = () => {
    markCompleted(5);
    // Clear saved progress
    localStorage.removeItem(STORAGE_KEY);
    // Redirect to dashboard with welcome state
    router.push('/dashboard?welcome=true');
  };

  const handlePropertyTypeToggle = (type: string) => {
    setPreferences((prev) => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(type)
        ? prev.propertyTypes.filter((t) => t !== type)
        : [...prev.propertyTypes, type],
    }));
  };

  const InputField = ({
    label,
    value,
    onChange,
    placeholder,
    error,
    type = 'text',
  }: {
    label: string;
    value: string;
    onChange: (val: string) => void;
    placeholder: string;
    error?: string;
    type?: string;
  }) => (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[#CFD2E5]">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-lg border bg-[#282A35] px-3 py-2.5 text-sm text-[#CFD2E5] outline-none placeholder:text-[#8b8fa3]/50 ${
          error ? 'border-[#E53935]' : 'border-[#3a3c4e] focus:border-[#C6AB4E]'
        }`}
      />
      {error && (
        <p className="mt-1 flex items-center gap-1 text-xs text-[#E53935]">
          <AlertTriangle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );

  const FileUploadArea = ({
    label,
    file,
    onFile,
    required = false,
  }: {
    label: string;
    file: File | null;
    onFile: (f: File | null) => void;
    required?: boolean;
  }) => (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[#CFD2E5]">
        {label}
        {required && <span className="ml-1 text-[#E53935]">*</span>}
      </label>
      <div className="rounded-lg border-2 border-dashed border-[#3a3c4e] p-4 text-center transition-colors hover:border-[#C6AB4E]/50">
        {file ? (
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="h-5 w-5 text-[#4CAF50]" />
            <span className="text-sm text-[#CFD2E5]">{file.name}</span>
            <button
              onClick={() => onFile(null)}
              className="ml-2 text-xs text-[#E53935] hover:underline"
            >
              Remove
            </button>
          </div>
        ) : (
          <label className="cursor-pointer">
            <Upload className="mx-auto mb-2 h-8 w-8 text-[#8b8fa3]" />
            <p className="text-sm text-[#8b8fa3]">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-[#8b8fa3]/60">PDF, JPG, or PNG (max 10MB)</p>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onFile(f);
              }}
            />
          </label>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#282A35] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1
            className="text-3xl font-bold text-[#CFD2E5]"
            style={{ fontFamily: 'Volkhov, serif' }}
          >
            Welcome to NorthLend Financial
          </h1>
          <p className="mt-2 text-[#8b8fa3]">
            Let&apos;s get your account set up. This should only take a few minutes.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-10">
          <StepIndicator
            steps={STEPS}
            currentStep={currentStep}
            completedSteps={completedSteps}
          />
        </div>

        {/* Step 1: Complete Your Profile */}
        {currentStep === 1 && (
          <OnboardingStep
            title="Complete Your Profile"
            description="Tell us a bit about yourself so we can personalize your experience."
            onNext={handleStep1Next}
            isFirst
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputField
                  label="First Name"
                  value={profile.firstName}
                  onChange={(val) => setProfile((p) => ({ ...p, firstName: val }))}
                  placeholder="John"
                  error={errors.firstName}
                />
                <InputField
                  label="Last Name"
                  value={profile.lastName}
                  onChange={(val) => setProfile((p) => ({ ...p, lastName: val }))}
                  placeholder="Smith"
                  error={errors.lastName}
                />
              </div>
              <InputField
                label="Phone Number"
                value={profile.phone}
                onChange={(val) => setProfile((p) => ({ ...p, phone: val }))}
                placeholder="+1 (416) 555-0123"
                type="tel"
                error={errors.phone}
              />
              <InputField
                label="Address"
                value={profile.address}
                onChange={(val) => setProfile((p) => ({ ...p, address: val }))}
                placeholder="123 Bay Street, Toronto, ON M5J 2T3"
                error={errors.address}
              />
            </div>
          </OnboardingStep>
        )}

        {/* Step 2: Upload KYC Documents */}
        {currentStep === 2 && (
          <OnboardingStep
            title="Upload KYC Documents"
            description="Upload your identity verification documents. These are required for regulatory compliance."
            onNext={handleStep2Next}
            onBack={goToBack}
            onSkip={handleStep2Skip}
            showSkip
          >
            <div className="space-y-5">
              <FileUploadArea
                label="Government-Issued ID"
                file={governmentId}
                onFile={setGovernmentId}
                required
              />
              <FileUploadArea
                label="Proof of Address"
                file={proofOfAddress}
                onFile={setProofOfAddress}
                required
              />
              <FileUploadArea
                label="Accreditation Documents (Optional)"
                file={accreditation}
                onFile={setAccreditation}
              />
            </div>
          </OnboardingStep>
        )}

        {/* Step 3: Set Investment Preferences */}
        {currentStep === 3 && (
          <OnboardingStep
            title="Set Investment Preferences"
            description="Help us tailor deal recommendations to your investment criteria."
            onNext={handleStep3Next}
            onBack={goToBack}
          >
            <div className="space-y-6">
              {/* Risk Tolerance */}
              <div>
                <label className="mb-3 block text-sm font-medium text-[#CFD2E5]">
                  Risk Tolerance
                </label>
                {errors.riskTolerance && (
                  <p className="mb-2 flex items-center gap-1 text-xs text-[#E53935]">
                    <AlertTriangle className="h-3 w-3" />
                    {errors.riskTolerance}
                  </p>
                )}
                <div className="space-y-2">
                  {[
                    { value: 'conservative', label: 'Conservative', desc: 'Lower risk, stable returns' },
                    { value: 'moderate', label: 'Moderate', desc: 'Balanced risk and return' },
                    { value: 'aggressive', label: 'Aggressive', desc: 'Higher risk, higher potential returns' },
                  ].map(({ value, label, desc }) => (
                    <label
                      key={value}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                        preferences.riskTolerance === value
                          ? 'border-[#C6AB4E] bg-[#C6AB4E]/10'
                          : 'border-[#3a3c4e] hover:border-[#8b8fa3]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="riskTolerance"
                        value={value}
                        checked={preferences.riskTolerance === value}
                        onChange={() =>
                          setPreferences((p) => ({ ...p, riskTolerance: value }))
                        }
                        className="h-4 w-4 accent-[#C6AB4E]"
                      />
                      <div>
                        <p className="text-sm font-medium text-[#CFD2E5]">{label}</p>
                        <p className="text-xs text-[#8b8fa3]">{desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Deal Size Range */}
              <div>
                <label className="mb-3 block text-sm font-medium text-[#CFD2E5]">
                  Preferred Deal Size Range
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs text-[#8b8fa3]">
                      Minimum ($)
                    </label>
                    <input
                      type="number"
                      value={preferences.minDealSize}
                      onChange={(e) =>
                        setPreferences((p) => ({
                          ...p,
                          minDealSize: e.target.value,
                        }))
                      }
                      placeholder="50,000"
                      className="w-full rounded-lg border border-[#3a3c4e] bg-[#282A35] px-3 py-2.5 text-sm text-[#CFD2E5] outline-none placeholder:text-[#8b8fa3]/50 focus:border-[#C6AB4E]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-[#8b8fa3]">
                      Maximum ($)
                    </label>
                    <input
                      type="number"
                      value={preferences.maxDealSize}
                      onChange={(e) =>
                        setPreferences((p) => ({
                          ...p,
                          maxDealSize: e.target.value,
                        }))
                      }
                      placeholder="500,000"
                      className="w-full rounded-lg border border-[#3a3c4e] bg-[#282A35] px-3 py-2.5 text-sm text-[#CFD2E5] outline-none placeholder:text-[#8b8fa3]/50 focus:border-[#C6AB4E]"
                    />
                  </div>
                </div>
              </div>

              {/* Property Types */}
              <div>
                <label className="mb-3 block text-sm font-medium text-[#CFD2E5]">
                  Preferred Property Types
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {[
                    'Multifamily',
                    'Commercial',
                    'Industrial',
                    'Retail',
                    'Mixed-Use',
                    'Land',
                    'Office',
                    'Hospitality',
                    'Student Housing',
                  ].map((type) => (
                    <label
                      key={type}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                        preferences.propertyTypes.includes(type)
                          ? 'border-[#C6AB4E] bg-[#C6AB4E]/10 text-[#C6AB4E]'
                          : 'border-[#3a3c4e] text-[#8b8fa3] hover:border-[#8b8fa3]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={preferences.propertyTypes.includes(type)}
                        onChange={() => handlePropertyTypeToggle(type)}
                        className="h-3.5 w-3.5 accent-[#C6AB4E]"
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </OnboardingStep>
        )}

        {/* Step 4: Sign Master NDA */}
        {currentStep === 4 && (
          <OnboardingStep
            title="Sign Master NDA"
            description="Review and sign the Non-Disclosure Agreement to access detailed deal information."
            onNext={handleStep4Next}
            onBack={goToBack}
            onSkip={handleStep4Skip}
            showSkip
            nextDisabled={!ndaAccepted || !ndaFullName.trim()}
          >
            <div className="space-y-5">
              {/* NDA Text */}
              <div className="max-h-64 overflow-y-auto rounded-lg border border-[#3a3c4e] bg-[#282A35] p-4 text-sm leading-relaxed text-[#8b8fa3]">
                <h4 className="mb-3 font-semibold text-[#CFD2E5]">
                  NON-DISCLOSURE AGREEMENT
                </h4>
                <p className="mb-2">
                  This Non-Disclosure Agreement (&quot;Agreement&quot;) is entered into as of the date
                  of electronic signature below, by and between NorthLend Financial Inc.
                  (&quot;Company&quot;) and the undersigned individual (&quot;Recipient&quot;).
                </p>
                <p className="mb-2">
                  <strong className="text-[#CFD2E5]">1. Confidential Information.</strong>{' '}
                  &quot;Confidential Information&quot; means all non-public information disclosed by the
                  Company to the Recipient, including but not limited to: deal structures, financial
                  projections, property valuations, investor lists, underwriting models, and
                  proprietary business strategies.
                </p>
                <p className="mb-2">
                  <strong className="text-[#CFD2E5]">2. Obligations.</strong> The Recipient agrees to:
                  (a) maintain the confidentiality of all Confidential Information; (b) not disclose
                  Confidential Information to any third party without prior written consent; (c) use
                  Confidential Information solely for the purpose of evaluating potential investment
                  opportunities.
                </p>
                <p className="mb-2">
                  <strong className="text-[#CFD2E5]">3. Term.</strong> This Agreement shall remain in
                  effect for a period of two (2) years from the date of execution, and shall survive
                  any termination of the business relationship.
                </p>
                <p className="mb-2">
                  <strong className="text-[#CFD2E5]">4. Remedies.</strong> The Recipient acknowledges
                  that any breach of this Agreement may cause irreparable harm, and the Company shall
                  be entitled to seek equitable relief in addition to any other remedies available at
                  law.
                </p>
                <p>
                  <strong className="text-[#CFD2E5]">5. Governing Law.</strong> This Agreement shall
                  be governed by the laws of the Province of Ontario, Canada.
                </p>
              </div>

              {/* Agreement Checkbox */}
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={ndaAccepted}
                  onChange={(e) => setNdaAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[#C6AB4E]"
                />
                <span className="text-sm text-[#CFD2E5]">
                  I have read and agree to the terms of this Non-Disclosure Agreement
                </span>
              </label>

              {/* Signature */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#CFD2E5]">
                  Full Legal Name (E-Signature)
                </label>
                <input
                  type="text"
                  value={ndaFullName}
                  onChange={(e) => setNdaFullName(e.target.value)}
                  placeholder="Enter your full legal name"
                  className="w-full rounded-lg border border-[#3a3c4e] bg-[#282A35] px-3 py-2.5 text-sm text-[#CFD2E5] outline-none placeholder:text-[#8b8fa3]/50 focus:border-[#C6AB4E]"
                  style={{ fontFamily: 'cursive' }}
                />
              </div>
            </div>
          </OnboardingStep>
        )}

        {/* Step 5: Platform Tour */}
        {currentStep === 5 && (
          <OnboardingStep
            title="Platform Tour"
            description="Here's a quick overview of what you can do on NorthLend Financial."
            onNext={handleComplete}
            onBack={goToBack}
            isLast
            nextLabel="Complete Onboarding"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: LayoutDashboard,
                  title: 'Dashboard Overview',
                  description:
                    'Your dashboard gives you a snapshot of your portfolio, including total invested, active deals, pending returns, and yield-to-date. Check it daily for updates.',
                },
                {
                  icon: Search,
                  title: 'Browse Opportunities',
                  description:
                    'Explore curated investment opportunities in the Opportunities section. Each deal includes detailed financials, risk ratings, and property information.',
                },
                {
                  icon: Handshake,
                  title: 'Commit to a Deal',
                  description:
                    'When you find an opportunity that matches your criteria, submit your commitment amount. Our team will review and confirm your allocation.',
                },
                {
                  icon: MessageCircle,
                  title: 'Message Your Underwriter',
                  description:
                    'Have questions about a deal? Use the Messages section to communicate directly with your assigned underwriter and get real-time responses.',
                },
                {
                  icon: FileBarChart,
                  title: 'Access Reports',
                  description:
                    'Find all your financial reports, tax documents, and deal performance summaries in the Reports section. Download anytime for your records.',
                },
              ].map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-lg border border-[#3a3c4e] bg-[#282A35] p-4 transition-colors hover:border-[#C6AB4E]/30"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#C6AB4E]/10">
                    <Icon className="h-5 w-5 text-[#C6AB4E]" />
                  </div>
                  <h4
                    className="mb-1 text-sm font-semibold text-[#CFD2E5]"
                    style={{ fontFamily: 'Volkhov, serif' }}
                  >
                    {title}
                  </h4>
                  <p className="text-xs leading-relaxed text-[#8b8fa3]">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </OnboardingStep>
        )}
      </div>
    </div>
  );
}
