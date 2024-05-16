'use client';
import React from 'react';

export function Select(props) {
  return (
    <select
      className="input p2 text-black px-2 rounded-lg ml-2"
      onChange={props.onChange}
    >
      {props.items.map((item) => {
        const dataAttr = {
          [`data-${props.dataset}`]: item.deviceId,
        };
        return (
          <option key={item.deviceId} value={item.deviceId} {...dataAttr}>
            {item.label}
          </option>
        );
      })}
    </select>
  );
}
