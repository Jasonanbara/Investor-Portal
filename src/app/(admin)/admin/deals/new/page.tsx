'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Building,
  DollarSign,
  Shield,
  User,
  Save,
  Send,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface FormData {
  propertyAddress: string;
  propertyCity: string;
  propertyProvince: string;
  propertyPostalCode: string;
  propertyType: string;
  propertyValue: string;
  propertyDescription: string;
  loanAmount: string;
  loanType: string;
  interestRate: string;
  termMonths: string;
  ltv: string;
  paymentFrequency: string;
  amortization: string;
  riskRating: string;
  fundingGoal: string;
  minimumInvestment: string;
  maximumInvestment: string;
  targetCloseDate: string;
  borrowerName: string;
  borrowerEmail: string;
  borrowerPhone: string;
  borrowerCompany: string;
  borrowerCreditScore: string;
  borrowerExperience: string;
}

const initialForm: FormData = {
  propertyAddress: '',
  propertyCity: '',
  propertyProvince: 'ON',
  propertyPostalCode: '',
  propertyType: 'residential',
  propertyValue: '',
  propertyDescription: '',
  loanAmount: '',
  loanType: 'bridge',
  interestRate: '',
  termMonths: '12',
  ltv: '',
  paymentFrequency: 'monthly',
  amortization: 'interest_only',
  riskRating: 'moderate',
  fundingGoal: '',
  minimumInvestment: '25000',
  maximumInvestment: '',
  targetCloseDate: '',
  borrowerName: '',
  borrowerEmail: '',
  borrowerPhone: '',
  borrowerCompany: '',
  borrowerCreditScore: '',
  borrowerExperience: '',
};

export default function NewDealPage() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.propertyAddress) e.propertyAddress = 'Address is required';
    if (!form.propertyCity) e.propertyCity = 'City is required';
    if (!form.propertyValue) e.propertyValue = 'Property value is required';
    if (!form.loanAmount) e.loanAmount = 'Loan amount is required';
    if (!form.interestRate) e.interestRate = 'Interest rate is required';
    if (!form.fundingGoal) e.fundingGoal = 'Funding goal is required';
    if (!form.borrowerName) e.borrowerName = 'Borrower name is required';
    if (!form.borrowerEmail) e.borrowerEmail = 'Borrower email is required';
    if (!form.targetCloseDate) e.targetCloseDate = 'Target close date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = () => {
    if (validate()) {
      toast.success('Deal created successfully');
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const handleSaveDraft = () => {
    toast.success('Draft saved successfully');
  };

  const inputStyle = {
    backgroundColor: '#282A35',
    border: '1px solid #3a3c4e',
    color: '#CFD2E5',
  };

  const errorInputStyle = {
    backgroundColor: '#282A35',
    border: '1px solid #E53935',
    color: '#CFD2E5',
  };

  const renderInput = (label: string, field: keyof FormData, type = 'text', placeholder = '', required = false) => (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: '#CFD2E5' }}>
        {label} {required && <span style={{ color: '#E53935' }}>*</span>}
      </label>
      <input
        type={type}
        value={form[field]}
        onChange={(e) => update(field, e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-1"
        style={errors[field] ? errorInputStyle : inputStyle}
      />
      {errors[field] && <p className="text-xs mt-1" style={{ color: '#E53935' }}>{errors[field]}</p>}
    </div>
  );

  const renderSelect = (label: string, field: keyof FormData, options: { value: string; label: string }[], required = false) => (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: '#CFD2E5' }}>
        {label} {required && <span style={{ color: '#E53935' }}>*</span>}
      </label>
      <select
        value={form[field]}
        onChange={(e) => update(field, e.target.value)}
        className="w-full px-3 py-2 rounded-lg text-sm outline-none appearance-none cursor-pointer"
        style={inputStyle}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/deals" className="flex items-center gap-2 text-sm hover:underline mb-2" style={{ color: '#C6AB4E' }}>
            <ArrowLeft className="w-4 h-4" />
            Back to Deals
          </Link>
          <h1 className="text-2xl font-bold" style={{ color: '#CFD2E5' }}>Create New Deal</h1>
          <p className="text-sm mt-1" style={{ color: '#8b8fa3' }}>Fill in the details to create a new mortgage deal.</p>
        </div>
      </div>

      {/* Property Information */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: '#2E3040', border: '1px solid #3a3c4e' }}>
        <div className="flex items-center gap-2 mb-5">
          <Building className="w-5 h-5" style={{ color: '#C6AB4E' }} />
          <h2 className="text-lg font-semibold" style={{ color: '#CFD2E5' }}>Property Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderInput('Street Address', 'propertyAddress', 'text', '123 Main St', true)}
          {renderInput('City', 'propertyCity', 'text', 'Toronto', true)}
          {renderSelect('Province', 'propertyProvince', [
            { value: 'ON', label: 'Ontario' }, { value: 'BC', label: 'British Columbia' },
            { value: 'AB', label: 'Alberta' }, { value: 'QC', label: 'Quebec' },
            { value: 'MB', label: 'Manitoba' }, { value: 'SK', label: 'Saskatchewan' },
          ])}
          {renderInput('Postal Code', 'propertyPostalCode', 'text', 'M5V 2T6')}
          {renderSelect('Property Type', 'propertyType', [
            { value: 'residential', label: 'Residential' }, { value: 'commercial', label: 'Commercial' },
            { value: 'mixed_use', label: 'Mixed Use' }, { value: 'land', label: 'Land' },
            { value: 'industrial', label: 'Industrial' },
          ])}
          {renderInput('Appraised Value ($)', 'propertyValue', 'text', '2,500,000', true)}
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1.5" style={{ color: '#CFD2E5' }}>Property Description</label>
          <textarea
            value={form.propertyDescription}
            onChange={(e) => update('propertyDescription', e.target.value)}
            rows={3}
            placeholder="Brief description of the property..."
            className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
            style={inputStyle}
          />
        </div>
      </div>

      {/* Loan Terms */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: '#2E3040', border: '1px solid #3a3c4e' }}>
        <div className="flex items-center gap-2 mb-5">
          <DollarSign className="w-5 h-5" style={{ color: '#C6AB4E' }} />
          <h2 className="text-lg font-semibold" style={{ color: '#CFD2E5' }}>Loan Terms</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderInput('Loan Amount ($)', 'loanAmount', 'text', '2,000,000', true)}
          {renderSelect('Loan Type', 'loanType', [
            { value: 'bridge', label: 'Bridge Loan' }, { value: 'construction', label: 'Construction Loan' },
            { value: 'term', label: 'Term Loan' }, { value: 'mezzanine', label: 'Mezzanine' },
          ], true)}
          {renderInput('Interest Rate (%)', 'interestRate', 'text', '8.5', true)}
          {renderInput('Term (Months)', 'termMonths', 'number', '12')}
          {renderInput('LTV Ratio (%)', 'ltv', 'text', '65')}
          {renderSelect('Payment Frequency', 'paymentFrequency', [
            { value: 'monthly', label: 'Monthly' }, { value: 'quarterly', label: 'Quarterly' },
            { value: 'semi_annual', label: 'Semi-Annual' }, { value: 'annual', label: 'Annual' },
          ])}
          {renderSelect('Amortization', 'amortization', [
            { value: 'interest_only', label: 'Interest Only' }, { value: 'fully_amortizing', label: 'Fully Amortizing' },
            { value: 'partial', label: 'Partial Amortization' },
          ])}
        </div>
      </div>

      {/* Risk & Funding */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: '#2E3040', border: '1px solid #3a3c4e' }}>
        <div className="flex items-center gap-2 mb-5">
          <Shield className="w-5 h-5" style={{ color: '#C6AB4E' }} />
          <h2 className="text-lg font-semibold" style={{ color: '#CFD2E5' }}>Risk & Funding</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderSelect('Risk Rating', 'riskRating', [
            { value: 'low', label: 'Low Risk' }, { value: 'moderate', label: 'Moderate Risk' },
            { value: 'high', label: 'High Risk' },
          ])}
          {renderInput('Funding Goal ($)', 'fundingGoal', 'text', '2,000,000', true)}
          {renderInput('Minimum Investment ($)', 'minimumInvestment', 'text', '25,000')}
          {renderInput('Maximum Investment ($)', 'maximumInvestment', 'text', '500,000')}
          {renderInput('Target Close Date', 'targetCloseDate', 'date', '', true)}
        </div>
      </div>

      {/* Borrower Info */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: '#2E3040', border: '1px solid #3a3c4e' }}>
        <div className="flex items-center gap-2 mb-5">
          <User className="w-5 h-5" style={{ color: '#C6AB4E' }} />
          <h2 className="text-lg font-semibold" style={{ color: '#CFD2E5' }}>Borrower Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderInput('Full Name', 'borrowerName', 'text', 'John Smith', true)}
          {renderInput('Email', 'borrowerEmail', 'email', 'john@company.com', true)}
          {renderInput('Phone', 'borrowerPhone', 'tel', '+1 (555) 123-4567')}
          {renderInput('Company', 'borrowerCompany', 'text', 'Smith Development Corp')}
          {renderInput('Credit Score', 'borrowerCreditScore', 'text', '750')}
          {renderSelect('Experience', 'borrowerExperience', [
            { value: '', label: 'Select experience...' },
            { value: 'first_time', label: 'First Time Borrower' },
            { value: '1_3_years', label: '1-3 Years' },
            { value: '3_5_years', label: '3-5 Years' },
            { value: '5_10_years', label: '5-10 Years' },
            { value: '10_plus', label: '10+ Years' },
          ])}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Link href="/admin/deals" className="px-5 py-2.5 rounded-lg text-sm font-medium" style={{ color: '#8b8fa3', border: '1px solid #3a3c4e' }}>
          Cancel
        </Link>
        <button
          onClick={handleSaveDraft}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
          style={{ backgroundColor: 'rgba(198, 171, 78, 0.1)', color: '#C6AB4E', border: '1px solid #C6AB4E' }}
        >
          <Save className="w-4 h-4" />
          Save Draft
        </button>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
          style={{ backgroundColor: '#C6AB4E', color: '#282A35' }}
        >
          <Send className="w-4 h-4" />
          Create Deal
        </button>
      </div>
    </div>
  );
}
