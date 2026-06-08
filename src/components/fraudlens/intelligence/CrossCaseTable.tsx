import React from 'react';
import { Link } from '@tanstack/react-router';

interface CrossCaseLink {
  account: string;
  total_volume: number;
  txn_count: number;
  linked_cases: { id: string, case_number: string }[];
}

interface Props {
  links: CrossCaseLink[];
}

export default function CrossCaseTable({ links }: Props) {
  return (
    <div className="bg-background-surface border border-white/5 rounded-xl overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-background-card border-b border-white/5">
            <th className="px-4 py-3 text-xs font-semibold text-white/40 uppercase font-mono">Shared Account</th>
            <th className="px-4 py-3 text-xs font-semibold text-white/40 uppercase font-mono">Total Volume (INR)</th>
            <th className="px-4 py-3 text-xs font-semibold text-white/40 uppercase font-mono">Txns</th>
            <th className="px-4 py-3 text-xs font-semibold text-white/40 uppercase font-mono">Linked Cases</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {links.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-white/40">
                No cross-case overlaps detected in the database.
              </td>
            </tr>
          ) : links.map((link, i) => (
            <tr key={i} className="hover:bg-white/[0.02] transition-colors">
              <td className="px-4 py-3">
                <span className="font-mono text-amber-400 font-bold">{link.account}</span>
              </td>
              <td className="px-4 py-3 font-mono text-white">
                ₹{link.total_volume.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-white/60">{link.txn_count}</td>
              <td className="px-4 py-3 flex flex-wrap gap-2">
                {link.linked_cases.map(c => (
                  <Link 
                    key={c.id} 
                    to="/fraudlens"
                    className="px-2 py-1 bg-primary-900/30 text-primary-400 border border-primary-500/20 rounded text-xs font-mono hover:bg-primary-500/20 transition-colors"
                  >
                    {c.case_number}
                  </Link>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
