import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import Svg, {Path, Circle, Line, Defs, LinearGradient, Stop} from 'react-native-svg';

interface WeightEntry {
    weight_kg: number;
    logged_at: string;
}

interface Props {
    data: WeightEntry[]; // descending from API — we reverse internally
    width: number;
}

const CHART_HEIGHT = 160;
const PADDING = {top: 16, bottom: 32, left: 40, right: 16};

function formatDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleDateString('nl-NL', {day: 'numeric', month: 'short'});
}

export default function WeightChart({data, width}: Props) {
    if (data.length < 2) return null;

    // Oldest first for left-to-right reading
    const entries = [...data].reverse();
    const weights = entries.map(e => e.weight_kg);

    const rawMin = Math.min(...weights);
    const rawMax = Math.max(...weights);
    const padding = rawMin === rawMax ? 1 : (rawMax - rawMin) * 0.15;
    const minW = rawMin - padding;
    const maxW = rawMax + padding;

    const innerW = width - PADDING.left - PADDING.right;
    const innerH = CHART_HEIGHT - PADDING.top - PADDING.bottom;
    const n = entries.length;

    function xPos(i: number): number {
        return PADDING.left + (i / (n - 1)) * innerW;
    }

    function yPos(w: number): number {
        return PADDING.top + (1 - (w - minW) / (maxW - minW)) * innerH;
    }

    // Build SVG path (smooth bezier)
    const points = entries.map((e, i) => ({x: xPos(i), y: yPos(e.weight_kg)}));

    let linePath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const cpx = (prev.x + curr.x) / 2;
        linePath += ` C ${cpx} ${prev.y} ${cpx} ${curr.y} ${curr.x} ${curr.y}`;
    }

    // Area fill path (close to bottom)
    const bottomY = PADDING.top + innerH;
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${bottomY} L ${points[0].x} ${bottomY} Z`;

    // Decide which X labels to show (max 5)
    const labelStep = Math.max(1, Math.ceil(n / 5));
    const labelIndices = entries.map((_, i) => i).filter(i => i === 0 || i === n - 1 || i % labelStep === 0);

    // Y axis labels
    const yLabels = [rawMin, (rawMin + rawMax) / 2, rawMax].map(v => Math.round(v * 10) / 10);

    return (
        <View>
            <Svg width={width} height={CHART_HEIGHT}>
                <Defs>
                    <LinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0" stopColor="#4ADE80" stopOpacity="0.25"/>
                        <Stop offset="1" stopColor="#4ADE80" stopOpacity="0"/>
                    </LinearGradient>
                </Defs>

                {/* Horizontal grid lines */}
                {yLabels.map((val, i) => {
                    const y = yPos(val);
                    return (
                        <Line
                            key={i}
                            x1={PADDING.left}
                            y1={y}
                            x2={width - PADDING.right}
                            y2={y}
                            stroke="#2A2A2A"
                            strokeWidth={1}
                        />
                    );
                })}

                {/* Area fill */}
                <Path d={areaPath} fill="url(#areaGrad)"/>

                {/* Line */}
                <Path d={linePath} stroke="#4ADE80" strokeWidth={2} fill="none" strokeLinecap="round"/>

                {/* Dots */}
                {points.map((p, i) => (
                    <Circle key={i} cx={p.x} cy={p.y} r={3} fill="#4ADE80"/>
                ))}
            </Svg>

            {/* X axis labels (below SVG) */}
            <View style={[styles.xLabels, {marginLeft: PADDING.left, marginRight: PADDING.right}]}>
                {labelIndices.map(i => {
                    const pct = n === 1 ? 0 : i / (n - 1);
                    return (
                        <Text
                            key={i}
                            style={[styles.xLabel, {left: `${pct * 100}%`}]}
                            numberOfLines={1}
                        >
                            {formatDate(entries[i].logged_at)}
                        </Text>
                    );
                })}
            </View>

            {/* Y axis labels */}
            <View style={[styles.yLabels, {top: PADDING.top - 6, height: innerH + 12, left: 0, width: PADDING.left - 4}]}>
                {yLabels.map((val, i) => {
                    const pct = i / (yLabels.length - 1);
                    return (
                        <Text
                            key={i}
                            style={[styles.yLabel, {top: `${(1 - pct) * 100}%`}]}
                        >
                            {val}
                        </Text>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    xLabels: {
        position: 'relative',
        height: 20,
        marginTop: -20,
    },
    xLabel: {
        position: 'absolute',
        color: '#555',
        fontSize: 10,
        transform: [{translateX: -18}],
    },
    yLabels: {
        position: 'absolute',
    },
    yLabel: {
        position: 'absolute',
        color: '#555',
        fontSize: 10,
        textAlign: 'right',
        width: '100%',
        transform: [{translateY: -6}],
    },
});
