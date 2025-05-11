import Image from 'next/image';
import React, { useState } from 'react';
import styled from 'styled-components';
import Checkbox from './Checkbox';
const Title = styled.div`
  padding: 60px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Small = styled.div`
  font-weight: 600;
  font-size: 11.25px;
  line-height: 12px;
  letter-spacing: 1.4px;
  text-align: center;
  vertical-align: middle;
  text-transform: uppercase;
`;

const Big = styled.div`
  font-weight: 300;
  font-size: 44.25px;
  line-height: 52px;
  letter-spacing: 0%;
  text-align: center;
  vertical-align: middle;
  @media screen and (max-width: 1120px) {
    font-size: 25px;
  }
`;

const Page = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 92px;
  margin-bottom: 28px;
  @media screen and (max-width: 900px) {
    grid-template-rows: auto auto;
    grid-template-columns: 1fr;
    padding-inline: 32px;
  }
`;

const Inputs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 36px;
  width: 374px;
  margin-left: auto;
  @media screen and (max-width: 900px) {
    margin-inline: auto;
    width: 100%;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 154px;
  background-color: rgba(38, 38, 38, 1);
  border: 1px solid rgba(38, 38, 38, 1);
  padding: 12px 16px;
  outline: none;
  resize: none;
  color: white;
`;

const Input = styled.input`
  outline: none;
  color: white;
  padding: 12px 16px;
  background-color: rgba(38, 38, 38, 1);
  border: 1px solid rgba(38, 38, 38, 1);
  &:nth-of-type(1):focus,
  &:nth-of-type(2):focus {
    border-color: red;
  }
`;

const Contacts = styled.div`
  width: 374px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  @media screen and (max-width: 900px) {
    margin-inline: auto;
    width: 100%;
  }
`;

const Comp = styled.div`
  font-weight: 300;
  font-size: 12.69px;
  line-height: 21px;
  letter-spacing: 0%;
  vertical-align: middle;
  color: rgba(212, 212, 212, 1);
`;

const Shop = styled.div`
  width: fit-content;
  padding: 4px 32px;
  border: 2px solid white;
  background-color: white;
  color: rgba(8, 8, 8, 1);
  text-align: center;
  font-weight: 600;
  font-size: 12.91px;
  line-height: 16px;
  letter-spacing: 0%;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
`;

const Heading = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  font-weight: 500;
  font-size: 18.59px;
  line-height: 48px;
  letter-spacing: 0.2px;
  vertical-align: middle;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
`;

const ListItem = styled.li`
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 8px;
  position: relative;
  padding-left: 20px;

  &:before {
    content: '•';
    position: absolute;
    left: 0;
    color: white;
  }
`;

const Paragraph = styled.p`
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 20px;
  font-weight: 300;
  font-size: 12.91px;
  line-height: 21px;
  letter-spacing: 0%;
  vertical-align: middle;
  color: rgba(212, 212, 212, 1);
`;

const ContactSection = styled.div`
  display: flex;
  align-items: center;
  padding: 21px;
  gap: 20px;
  border: 1px solid rgba(255, 255, 255, 1);
  @media screen and (max-width: 900px) {
    border-left: none;
    border-right: none;
  }
`;

const ContactImage = styled.div``;

const ContactText = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 14px;
  line-height: 1.5;
  height: 100%;
`;

const PhoneNumber = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;
const Adveice = styled.div`
  font-weight: 300;
  font-size: 13.02px;
  line-height: 21px;
  letter-spacing: 0%;
  vertical-align: middle;
  color: rgba(168, 168, 168, 1);
`;
const Num = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
  font-weight: 500;
  font-size: 18.13px;
  line-height: 30px;
  letter-spacing: 0%;
  vertical-align: middle;
`;

const ContactForm = ({ dictionary }: { dictionary: any }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    compulsory: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log('Form Data:', {
      name: formData.name,
      email: formData.email,
      telephone: formData.number,
      compulsory: formData.compulsory,
      isChecked: isChecked,
    });
  };

  return (
    <>
      <Title>
        <Small>{dictionary.smallTitle}</Small>
        <Big>{dictionary.bigTitle}</Big>
      </Title>
      <Page>
        <Inputs>
          <Input
            type="text"
            name="name"
            id="name"
            placeholder={dictionary.namePlaceholder}
            value={formData.name}
            onChange={handleInputChange}
          />
          <Input
            type="email"
            name="email"
            id="email"
            placeholder={dictionary.emailPlaceholder}
            value={formData.email}
            onChange={handleInputChange}
          />
          <Input
            type="number"
            name="number"
            id="number"
            placeholder={dictionary.telephonePlaceholder}
            value={formData.number}
            onChange={handleInputChange}
          />
          <Comp>
            <Textarea
              name="compulsory"
              id="compulsory"
              value={formData.compulsory}
              onChange={handleInputChange}
            />
            <p>{dictionary.compulsoryFields}</p>
          </Comp>
          <Checkbox checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)} />
          <Shop onClick={handleSubmit}>{dictionary.submitButton}</Shop>
        </Inputs>
        <Contacts>
          <Heading>{dictionary.choiceHeading}</Heading>
          <List>
            {dictionary.choices.map((choice: string, index: number) => (
              <ListItem key={index}>{choice}</ListItem>
            ))}
          </List>
          <Paragraph>{dictionary.choiceParagraph}</Paragraph>
          <ContactSection>
            <ContactImage>
              <Image src={'/assets/header/man.png'} width={70} height={70} alt="man" />
            </ContactImage>
            <ContactText>
              <PhoneNumber>
                <Image
                  src={'/assets/diamonds/phone.png'}
                  width={15}
                  height={15}
                  alt="phone"
                ></Image>
                <p>{dictionary.callUs}</p>
              </PhoneNumber>
              <Num>{dictionary.phoneNumber}</Num>
              <Adveice>{dictionary.advice}</Adveice>
            </ContactText>
          </ContactSection>
        </Contacts>
      </Page>
    </>
  );
};

export default ContactForm;
