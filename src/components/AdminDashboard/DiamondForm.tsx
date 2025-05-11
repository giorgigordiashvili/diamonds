'use client';

import ImageUploader from '@/components/ImageUploader';
import { getDictionary } from '@/get-dictionary';
import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';

// Types (should ideally be imported from a shared types file)
export interface Diamond {
  id?: string;
  name_en: string; // Changed from name
  name_ka: string; // Added
  shape: string;
  carat: number;
  color: string;
  clarity: string;
  cut: string;
  polish: string;
  symmetry: string;
  fluorescence: string;
  certificate: string;
  price: number;
  image?: string;
  description_en?: string; // Changed from description
  description_ka?: string; // Added
}

// Styled components
const Form = styled.form`
  max-width: 600px;
  margin: 0 auto;

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: 600;
  }

  input,
  select,
  textarea {
    width: 100%;
    padding: 8px;
    margin-bottom: 15px;
    border: 1px solid #333;
    background: transparent;
    color: inherit;
  }

  button {
    padding: 10px 20px;
    background: #333;
    color: white;
    border: none;
    cursor: pointer;
  }
`;

interface DiamondFormProps {
  adminDict: Awaited<ReturnType<typeof getDictionary>>['admin'];
  currentDiamond: Diamond | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  onImageUploaded: (fileId: string, url: string) => void;
}

export default function DiamondForm({
  adminDict,
  currentDiamond,
  onClose,
  onSubmit,
  onInputChange,
  onImageUploaded,
}: DiamondFormProps) {
  return (
    <Form onSubmit={onSubmit}>
      <h2>
        {currentDiamond?.id ? adminDict.diamondForm.editTitle : adminDict.diamondForm.addTitle}
      </h2>
      <div>
        <label htmlFor="name_en">{adminDict.diamondForm.nameEnLabel}</label>
        <input
          type="text"
          id="name_en"
          name="name_en"
          value={currentDiamond?.name_en || ''}
          onChange={onInputChange}
          required
        />
      </div>
      <div>
        <label htmlFor="name_ka">{adminDict.diamondForm.nameKaLabel}</label>
        <input
          type="text"
          id="name_ka"
          name="name_ka"
          value={currentDiamond?.name_ka || ''}
          onChange={onInputChange}
          required
        />
      </div>
      <div>
        <label htmlFor="shape">{adminDict.diamondForm.shapeLabel}</label>
        <select
          id="shape"
          name="shape"
          value={currentDiamond?.shape || 'Brilliant'}
          onChange={onInputChange}
          required
        >
          <option value="Brilliant">{adminDict.diamondForm.shapes.brilliant}</option>
          <option value="Princess">{adminDict.diamondForm.shapes.princess}</option>
          <option value="Emerald">{adminDict.diamondForm.shapes.emerald}</option>
          <option value="Oval">{adminDict.diamondForm.shapes.oval}</option>
          <option value="Marquise">{adminDict.diamondForm.shapes.marquise}</option>
          <option value="Radiant">{adminDict.diamondForm.shapes.radiant}</option>
          <option value="Cushion">{adminDict.diamondForm.shapes.cushion}</option>
          <option value="Asscher">{adminDict.diamondForm.shapes.asscher}</option>
          <option value="Heart">{adminDict.diamondForm.shapes.heart}</option>
        </select>
      </div>
      <div>
        <label htmlFor="carat">{adminDict.diamondForm.caratLabel}</label>
        <input
          type="number"
          id="carat"
          name="carat"
          step="0.01"
          value={currentDiamond?.carat || 0}
          onChange={onInputChange}
          required
        />
      </div>
      <div>
        <label htmlFor="color">{adminDict.diamondForm.colorLabel}</label>
        <select
          id="color"
          name="color"
          value={currentDiamond?.color || 'D'}
          onChange={onInputChange}
          required
        >
          <option value="D">{adminDict.diamondForm.colors.D}</option>
          <option value="E">{adminDict.diamondForm.colors.E}</option>
          <option value="F">{adminDict.diamondForm.colors.F}</option>
          <option value="G">{adminDict.diamondForm.colors.G}</option>
          <option value="H">{adminDict.diamondForm.colors.H}</option>
          <option value="I">{adminDict.diamondForm.colors.I}</option>
          <option value="J">{adminDict.diamondForm.colors.J}</option>
          <option value="K">{adminDict.diamondForm.colors.K}</option>
          <option value="L">{adminDict.diamondForm.colors.L}</option>
          <option value="M">{adminDict.diamondForm.colors.M}</option>
        </select>
      </div>
      <div>
        <label htmlFor="clarity">{adminDict.diamondForm.clarityLabel}</label>
        <select
          id="clarity"
          name="clarity"
          value={currentDiamond?.clarity || 'IF'}
          onChange={onInputChange}
          required
        >
          <option value="FL">{adminDict.diamondForm.clarities.FL}</option>
          <option value="IF">{adminDict.diamondForm.clarities.IF}</option>
          <option value="VVS1">{adminDict.diamondForm.clarities.VVS1}</option>
          <option value="VVS2">{adminDict.diamondForm.clarities.VVS2}</option>
          <option value="VS1">{adminDict.diamondForm.clarities.VS1}</option>
          <option value="VS2">{adminDict.diamondForm.clarities.VS2}</option>
          <option value="SI1">{adminDict.diamondForm.clarities.SI1}</option>
          <option value="SI2">{adminDict.diamondForm.clarities.SI2}</option>
          <option value="I1">{adminDict.diamondForm.clarities.I1}</option>
          <option value="I2">{adminDict.diamondForm.clarities.I2}</option>
          <option value="I3">{adminDict.diamondForm.clarities.I3}</option>
        </select>
      </div>
      <div>
        <label htmlFor="cut">{adminDict.diamondForm.cutLabel}</label>
        <select
          id="cut"
          name="cut"
          value={currentDiamond?.cut || 'Excellent'}
          onChange={onInputChange}
          required
        >
          <option value="Excellent">{adminDict.diamondForm.cuts.excellent}</option>
          <option value="Very Good">{adminDict.diamondForm.cuts.veryGood}</option>
          <option value="Good">{adminDict.diamondForm.cuts.good}</option>
          <option value="Fair">{adminDict.diamondForm.cuts.fair}</option>
          <option value="Poor">{adminDict.diamondForm.cuts.poor}</option>
        </select>
      </div>
      <div>
        <label htmlFor="polish">{adminDict.diamondForm.polishLabel}</label>
        <select
          id="polish"
          name="polish"
          value={currentDiamond?.polish || 'Excellent'}
          onChange={onInputChange}
          required
        >
          <option value="Excellent">{adminDict.diamondForm.cuts.excellent}</option>
          <option value="Very Good">{adminDict.diamondForm.cuts.veryGood}</option>
          <option value="Good">{adminDict.diamondForm.cuts.good}</option>
          <option value="Fair">{adminDict.diamondForm.cuts.fair}</option>
          <option value="Poor">{adminDict.diamondForm.cuts.poor}</option>
        </select>
      </div>
      <div>
        <label htmlFor="symmetry">{adminDict.diamondForm.symmetryLabel}</label>
        <select
          id="symmetry"
          name="symmetry"
          value={currentDiamond?.symmetry || 'Excellent'}
          onChange={onInputChange}
          required
        >
          <option value="Excellent">{adminDict.diamondForm.cuts.excellent}</option>
          <option value="Very Good">{adminDict.diamondForm.cuts.veryGood}</option>
          <option value="Good">{adminDict.diamondForm.cuts.good}</option>
          <option value="Fair">{adminDict.diamondForm.cuts.fair}</option>
          <option value="Poor">{adminDict.diamondForm.cuts.poor}</option>
        </select>
      </div>
      <div>
        <label htmlFor="fluorescence">{adminDict.diamondForm.fluorescenceLabel}</label>
        <select
          id="fluorescence"
          name="fluorescence"
          value={currentDiamond?.fluorescence || 'None'}
          onChange={onInputChange}
          required
        >
          <option value="None">{adminDict.diamondForm.fluorescences.none}</option>
          <option value="Faint">{adminDict.diamondForm.fluorescences.faint}</option>
          <option value="Medium">{adminDict.diamondForm.fluorescences.medium}</option>
          <option value="Strong">{adminDict.diamondForm.fluorescences.strong}</option>
          <option value="Very Strong">{adminDict.diamondForm.fluorescences.veryStrong}</option>
        </select>
      </div>
      <div>
        <label htmlFor="certificate">{adminDict.diamondForm.certificateLabel}</label>
        <select
          id="certificate"
          name="certificate"
          value={currentDiamond?.certificate || 'GIA'}
          onChange={onInputChange}
          required
        >
          <option value="GIA">{adminDict.diamondForm.certificates.gia}</option>
          <option value="IGI">{adminDict.diamondForm.certificates.igi}</option>
          <option value="HRD">{adminDict.diamondForm.certificates.hrd}</option>
          <option value="AGS">{adminDict.diamondForm.certificates.ags}</option>
          <option value="Other">{adminDict.diamondForm.certificates.other}</option>
        </select>
      </div>
      <div>
        <label htmlFor="price">{adminDict.diamondForm.priceLabel}</label>
        <input
          type="number"
          id="price"
          name="price"
          value={currentDiamond?.price || 0}
          onChange={onInputChange}
          required
        />
      </div>
      <div>
        <label htmlFor="description_en">{adminDict.diamondForm.descriptionEnLabel}</label>
        <textarea
          id="description_en"
          name="description_en"
          value={currentDiamond?.description_en || ''}
          onChange={onInputChange}
          rows={4}
        />
      </div>
      <div>
        <label htmlFor="description_ka">{adminDict.diamondForm.descriptionKaLabel}</label>
        <textarea
          id="description_ka"
          name="description_ka"
          value={currentDiamond?.description_ka || ''}
          onChange={onInputChange}
          rows={4}
        />
      </div>
      <ImageUploader onImageUploaded={onImageUploaded} currentImageUrl={currentDiamond?.image} />
      {currentDiamond?.image && (
        <div style={{ marginBottom: '15px' }}>
          <label>{adminDict.diamondForm.currentImageLabel}</label>
          <Image
            src={currentDiamond.image}
            alt={
              currentDiamond.name_en || adminDict.diamondForm.currentDiamondAlt || 'Diamond Image'
            }
            width={200}
            height={200}
            style={{ display: 'block', marginTop: '5px', objectFit: 'contain' }}
          />
        </div>
      )}
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button type="submit">{adminDict.diamondForm.saveButton}</button>
        <button type="button" onClick={onClose}>
          {adminDict.diamondForm.cancelButton}
        </button>
      </div>
    </Form>
  );
}
