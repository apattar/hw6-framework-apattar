package edu.cmu.cs214.hw6.plugins;

import java.util.List;
import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

import edu.cmu.cs214.hw6.framework.DataPlugin;

public class FileDataPlugin implements DataPlugin {
    public String getPluginName() {
        return "File Reader Plugin";
    }

    public List<String> getParameterMessages() {
        return List.of("Full path to file");
    }

    public String getInvalidMessage(List<String> parameters) {
        if (parameters.size() != 1) {
            return "Invalid number of parameters.";
        }

        File file = new File(parameters.get(0));
        if (!file.exists()) {
            return "File does not exist.";
        }
        if (!file.canRead()) {
            return "The indicated file is not readable.";
        }

        return null;
    }

    public String getText(List<String> parameters) {
        String text = "";
        try {
            File myObj = new File(parameters.get(0));
            Scanner myReader = new Scanner(myObj);
            while (myReader.hasNextLine()) {
                text += myReader.nextLine() + "\n";
            }
            myReader.close();
        } catch (FileNotFoundException e) {
            System.out.println("An error occurred while reading file.");
            e.printStackTrace();
        }
        return text;
    }
}
