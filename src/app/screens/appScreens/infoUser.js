import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function InformacoesPessoais() {
    const router = useRouter();
    const [email, setEmail] = useState('usuario@example.com');
    const [phone, setPhone] = useState('123456789');
    const [address, setAddress] = useState('Rua Exemplo, 123, Bairro, Cidade, Estado');
    const [birthDate, setBirthDate] = useState('01/01/1990');

    const handleSave = () => {
        // Lógica para salvar as informações atualizadas
        console.log('Informações salvas:', { email, phone, address, birthDate });

        // Exibir uma mensagem de confirmação
        Alert.alert('Sucesso', 'Informações salvas com sucesso!', [
            { text: 'OK', onPress: () => router.push('../tabs/perfil') }
        ]);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Informações Pessoais</Text>

            <View style={styles.infoContainer}>
                <Text style={styles.label}>E-mail</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Digite seu e-mail"
                    keyboardType="email-address"
                />
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.label}>Telefone</Text>
                <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Digite seu telefone"
                    keyboardType="phone-pad"
                />
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.label}>Endereço</Text>
                <TextInput
                    style={styles.input}
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Digite seu endereço"
                />
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.label}>Data de Nascimento</Text>
                <TextInput
                    style={styles.input}
                    value={birthDate}
                    onChangeText={setBirthDate}
                    placeholder="DD/MM/AAAA"
                    keyboardType="numeric"
                />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 50,
    },
    infoContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
    },
    saveButton: {
        marginTop: 20,
        backgroundColor: '#593C9D',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
