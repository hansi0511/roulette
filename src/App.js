import React, { useState } from 'react';

const europeanWheel = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6,
  27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
  16, 33, 1, 20, 14, 31, 9, 22, 18, 29,
  7, 28, 12, 35, 3, 26
];

export default function RouletteCalculator() {
  const [prevNumber, setPrevNumber] = useState('');
  const [currNumber, setCurrNumber] = useState('');
  const [direction, setDirection] = useState('CCW');
  const [bankroll, setBankroll] = useState(100);
  const [result, setResult] = useState(null);

  const getSkipDistance = (from, to, dir) => {
    const fromIndex = europeanWheel.indexOf(Number(from));
    const toIndex = europeanWheel.indexOf(Number(to));
    if (fromIndex === -1 || toIndex === -1) return null;
    return dir === 'CW'
      ? (toIndex - fromIndex + 37) % 37
      : (fromIndex - toIndex + 37) % 37;
  };

  const calculateBet = () => {
    const skip = getSkipDistance(prevNumber, currNumber, direction);
    if (skip === null) {
      setResult({ error: 'Invalid number input.' });
      return;
    }

    const isValid =
      (direction === 'CCW' && skip >= 8 && skip <= 24) ||
      (direction === 'CW' && skip >= 10 && skip <= 22);

    const betPerNumber = Math.min(5.0, Math.max(0.1, Math.floor(bankroll / 100) * 0.1));
    const totalBet = betPerNumber * 17;
    let sector = [];
    if (isValid) {
      const baseIndex = europeanWheel.indexOf(Number(prevNumber));
      for (let i = -8; i <= 8; i++) {
        let offset = direction === 'CW' ? (skip + i) : (-skip + i);
        let idx = (baseIndex + offset + 37) % 37;
        sector.push(europeanWheel[idx]);
      }
    }

    setResult({ skip, isValid, betPerNumber, totalBet, sector });
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">Roulette Sector Betting Calculator</h1>

      <div className="flex flex-col gap-2">
        <label>Previous Number</label>
        <input type="number" value={prevNumber} onChange={e => setPrevNumber(e.target.value)} className="border p-2 rounded" />

        <label>Current Number</label>
        <input type="number" value={currNumber} onChange={e => setCurrNumber(e.target.value)} className="border p-2 rounded" />

        <label>Spin Direction</label>
        <select value={direction} onChange={e => setDirection(e.target.value)} className="border p-2 rounded">
          <option value="CW">Clockwise</option>
          <option value="CCW">Counterclockwise</option>
        </select>

        <label>Bankroll ($)</label>
        <input type="number" value={bankroll} onChange={e => setBankroll(Number(e.target.value))} className="border p-2 rounded" />

        <button onClick={calculateBet} className="bg-blue-600 text-white p-2 rounded">Calculate</button>
      </div>

      {result && (
        <div className="mt-4 p-4 border rounded">
          {result.error ? (
            <p className="text-red-600">{result.error}</p>
          ) : result.isValid ? (
            <>
              <p><strong>Skip Distance:</strong> {result.skip}</p>
              <p><strong>Bet per Number:</strong> ${result.betPerNumber.toFixed(2)}</p>
              <p><strong>Total Bet:</strong> ${result.totalBet.toFixed(2)}</p>
              <p><strong>Bet on Sector:</strong> {result.sector.join(', ')}</p>
              <div className="mt-4">
                <h2 className="font-semibold">Visual Wheel Overlay</h2>
                <div className="grid grid-cols-6 gap-1 text-center mt-2">
                  {europeanWheel.map(num => (
                    <div
                      key={num}
                      className={`p-2 rounded ${result.sector.includes(num) ? 'bg-green-400 text-white font-bold' : 'bg-gray-100'}`}
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <p className="text-yellow-600">Skip distance {result.skip} is outside the optimal range. No bet recommended.</p>
          )}
        </div>
      )}
    </div>
  );
}
