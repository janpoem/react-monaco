import { MenuItem, Select } from '@mui/material';
import type { MonacoFileCodeInput } from '@react-monaco/core';
import tsx1 from './__files/App.tsx';
import py1 from './__files/backend.py';
import scss from './__files/badge.css';
import scala1 from './__files/Decidable.scala';
import java from './__files/FreqTableExampleOriginal.java';
import kt from './__files/ImageClientFragment.kt';
import go1 from './__files/indent_handler.go';
import ts1 from './__files/playgroud.ts';
import prisma from './__files/schema.prisma';
import dbml from './__files/Test.dbml';
import rs1 from './__files/trait.rs';
import json from './__files/vs.json';

export const FileSelectOptions: MonacoFileCodeInput[] = [
  tsx1,
  ts1,
  scss,
  rs1,
  py1,
  go1,
  java,
  kt,
  scala1,
  dbml,
  prisma,
  json,
];

export type FileSelectProps = {
  value: MonacoFileCodeInput;
  onChange?: (value: MonacoFileCodeInput) => void;
};

export const FileSelect = ({ value, onChange }: FileSelectProps) => {
  return (
    <Select
      value={value.filename}
      onChange={(ev) => {
        const item = FileSelectOptions.find(
          (it) => it.filename === ev.target.value,
        );
        if (item != null) {
          onChange?.(item);
        }
      }}
    >
      {FileSelectOptions.map((it) => (
        <MenuItem key={it.filename} value={it.filename}>
          {it.filename}
        </MenuItem>
      ))}
    </Select>
  );
};
